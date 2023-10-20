import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Loader from "../Loader/Loader";

interface AuthCheckerProps {
  children: React.ReactNode;
  redirect?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateToken = async (tokens: any) => {
  const { data } = await api.post("/auth/google/refresh-token", {
    refreshToken: tokens.refresh_token,
  });

  return data;
};

const AuthChecker: React.FC<AuthCheckerProps> = ({ children, redirect }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const oauth = localStorage.getItem("oauth");

  const { mutate } = useMutation(validateToken, {
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

  useEffect(() => {
    if (!oauth) {
      setIsAuthorized(false);

      return;
    }

    const tokens = JSON.parse(oauth);
    const { expiry_date: expirationDate } = tokens;
    const now = Date.now();

    if (expirationDate - now < 60000) {
      mutate(tokens);
    } else {
      setIsAuthorized(true);
    }
  }, [oauth]);

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
