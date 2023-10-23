import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Loader from "../Loader/Loader";

interface AuthCheckerProps {
  children: React.ReactNode;
  redirect?: string;
}

const validateOAuth = async (refreshToken: string) => {
  const { data } = await api.post("/auth/google/refresh-token", {
    refreshToken,
  });

  return data;
};

const validateInternalJWT = async (token: string) => {
  const { data } = await api.post("/auth/validate", {
    token,
  });

  return data;
};

const AuthChecker: React.FC<AuthCheckerProps> = ({ children, redirect }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const oauth = localStorage.getItem("oauth");
  const accessToken = localStorage.getItem("accessToken");

  const { mutate: validateOAuthMutation } = useMutation(validateOAuth, {
    onSuccess: (data) => {
      localStorage.setItem("oauth", JSON.stringify(data));
      localStorage.setItem("accessToken", data.id_token);

      setIsAuthorized(true);
    },
    onError: () => {
      setIsAuthorized(false);
      localStorage.removeItem("oauth");
      localStorage.removeItem("accessToken");
      alert("Please login again");
      navigate("/");
    },
  });

  const { mutate: validateInternalTokenMutation } = useMutation(
    validateInternalJWT,
    {
      onSuccess: () => {
        setIsAuthorized(true);
      },
      onError: () => {
        setIsAuthorized(false);
        localStorage.removeItem("accessToken");
        alert("Please login again");
        navigate("/");
      },
    }
  );

  useEffect(() => {
    if (!oauth && !accessToken) {
      setIsAuthorized(false);

      return;
    }

    if (oauth) {
      const tokens = JSON.parse(oauth);
      const { expiry_date: expirationDate } = tokens;
      const now = Date.now();

      if (expirationDate - now < 60000) {
        validateOAuthMutation(tokens.refresh_token);
      } else {
        setIsAuthorized(true);
      }
    }

    if (accessToken) {
      validateInternalTokenMutation(accessToken);
    }
  }, [oauth, accessToken]);

  useEffect(() => {
    if (redirect && isAuthorized) {
      navigate(redirect);
    }

    if (!redirect && !isAuthorized) {
      navigate("/");
    }
  }, [redirect, isAuthorized, oauth]);

  if (redirect && isAuthorized) {
    return <Loader />;
  }

  if (redirect && !isAuthorized) {
    return children;
  }

  return isAuthorized ? children : <Loader />;
};

export default AuthChecker;
