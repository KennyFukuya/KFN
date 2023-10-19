import React, { useId, useState } from "react";
import styled from "styled-components";
import { useGoogleLogin } from "@react-oauth/google";

import colors from "../constants/colors";
import LoginInput from "../components/LoginInput/LoginInput";
import axios from "axios";

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30px;
  width: 320px;
  height: 550px;
  border: 1px solid ${colors.dark.border};
  border-radius: 5px;
  box-shadow: 0px 0px 10px 7px ${colors.dark.border};
  background-color: ${colors.dark.primary};

  > form {
    width: 100%;
  }
`;

const Heading = styled.h1`
  color: ${colors.dark.secondary};
  font-size: 38px;
  margin-bottom: 30px;
`;

const LoginButton = styled.button`
  color: ${colors.dark.secondary};
  width: 100%;
  padding: 10px 5px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  border: 1px solid ${colors.dark.secondary};
  background-color: ${colors.dark.search.background};
  margin-top: 20px;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

const GoogleLogin = styled.button`
  background: ${colors.google};
  border-radius: 30px;
  border: none;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid ${colors.dark.secondary};

  > svg {
    width: 22px;
    height: 22px;
    fill: white;
  }
`;

const ExternalSourcesWrapper = styled.div`
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  > span {
    color: ${colors.dark.secondary};
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formId = useId();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const tokens = await axios.post("/api/auth/google", {
        code: codeResponse.code,
      });

      console.log({ tokens });
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(1);
  };

  return (
    <LoginWrapper>
      <Heading>Login</Heading>

      <form id={formId} onSubmit={handleSubmit}>
        <InputWrapper>
          <LoginInput
            inputLabel="Email"
            inputType="email"
            iconName="account_circle"
            formId={formId}
            value={email}
            placeholder="Type your email"
            onChange={handleEmailChange}
            required={true}
            inputName={"email"}
          />
        </InputWrapper>

        <InputWrapper>
          <LoginInput
            inputLabel="Password"
            inputType="password"
            iconName="lock"
            formId={formId}
            value={password}
            placeholder="Type your password"
            onChange={handlePasswordChange}
            required={true}
            inputName={"password"}
          />
        </InputWrapper>

        <LoginButton type={"submit"} form={formId}>
          LOGIN
        </LoginButton>
      </form>

      <ExternalSourcesWrapper>
        <span>Sign in with</span>

        <GoogleLogin onClick={googleLogin}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
            width="30px"
            height="30px"
          >
            <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z" />
          </svg>
        </GoogleLogin>
      </ExternalSourcesWrapper>
    </LoginWrapper>
  );
}

export default Login;
