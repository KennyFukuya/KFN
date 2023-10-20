import React, { useId, useState } from "react";
import styled from "styled-components";
import { useGoogleLogin } from "@react-oauth/google";

import colors from "../constants/colors";
import LoginInput from "../components/LoginInput/LoginInput";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

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

  > svg {
    width: 140px;
  }

  .cls-1 {
    fill: ${colors.light.white};
  }

  .cls-2 {
    fill: ${colors.dark.purple};
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  > svg {
    width: 16px;
    height: 16px;
  }

  .cls-1 {
    fill: ${colors.dark.purple};
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

const GoogleLogin = styled.button`
  background: ${colors.google};
  border-radius: 30px;
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
    fill: ${colors.light.white};
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
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const response = await api.post("/auth/google", {
        code: codeResponse.code,
      });

      localStorage.setItem("oauth", JSON.stringify(response.data));
      localStorage.setItem("accessToken", response.data.id_token);

      navigate("/messenger");
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

    console.log("TODO");
  };

  return (
    <LoginWrapper>
      <svg
        id="Camada_2"
        data-name="Camada 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 752.35 278.65"
      >
        <g id="Camada_1-2" data-name="Camada 1">
          <rect
            className="cls-2"
            width="752.35"
            height="278.65"
            rx="23.78"
            ry="23.78"
          />
          <g>
            <path
              className="cls-1"
              d="m94.73,71.76c0-1.09.35-2.02,1.04-2.81.69-.79,1.67-1.18,2.94-1.18h26.76c.9,0,1.85.36,2.85,1.09.99.72,1.49,1.69,1.49,2.9v49.39c6.58-8.46,13.05-16.8,19.4-25.01,6.34-8.22,12.78-16.55,19.3-25.01.66-1.03,1.53-1.86,2.58-2.49,1.06-.63,2.1-.95,3.13-.95h34.44c1.45,0,2.18.45,2.18,1.36,0,.61-.33,1.33-1,2.18l-42.69,56.28,47.22,71.06c.66,1.03,1,1.84,1,2.45,0,.91-.67,1.36-1.99,1.36h-34.26c-1.03,0-2.04-.3-3.04-.91-1-.6-1.83-1.42-2.49-2.45-3.2-4.35-6.12-8.52-8.75-12.51-2.63-3.99-5.18-7.96-7.66-11.92-2.48-3.96-4.98-7.96-7.52-12.01s-5.32-8.31-8.34-12.78l-11.51,13.23v35.35c0,2.66-1.45,3.99-4.34,3.99h-26.67c-2.71,0-4.07-1.33-4.07-3.99v-126.61Z"
            />
            <path
              className="cls-1"
              d="m234.21,71.94c0-1.27.35-2.27,1.04-2.99.69-.73,1.53-1.12,2.49-1.18h86.73c1.39,0,2.43.39,3.13,1.18.69.78,1.04,1.84,1.04,3.16v22.41c0,1.03-.36,2-1.09,2.94-.72.93-1.78,1.4-3.17,1.4h-55.11v28.1h40.69c1.15,0,2.12.32,2.9.95.79.63,1.18,1.65,1.18,3.04v21.66c0,1.03-.35,2.01-1.04,2.95-.7.94-1.65,1.41-2.86,1.41h-40.88v41.51c0,2.6-1.39,3.9-4.17,3.9h-27.64c-2.18-.3-3.26-1.57-3.26-3.81v-126.61Z"
            />
            <path
              className="cls-1"
              d="m351.4,71.76c0-1.09.33-2.02,1-2.81.66-.79,1.66-1.18,2.99-1.18h29.64c.84,0,1.72.21,2.63.63.91.42,1.69,1.15,2.36,2.17,7.67,12.39,15.29,24.59,22.84,36.62,7.55,12.02,15.19,24.23,22.93,36.62v-72.6c.24-1.09.72-1.93,1.45-2.54.72-.6,1.57-.91,2.54-.91h25.83c1.27,0,2.33.35,3.17,1.04.84.7,1.27,1.68,1.27,2.95v127.07c0,1.21-.36,2.1-1.09,2.67-.72.58-1.72.86-2.99.86h-28.91c-.79,0-1.48-.27-2.08-.82-.61-.54-1.24-1.27-1.9-2.18-8.04-13.29-15.98-26.43-23.84-39.42-7.85-12.99-15.83-26.13-23.93-39.42v77.85c0,1.33-.3,2.33-.91,2.99-.6.67-1.69,1-3.26,1h-25.74c-1.39,0-2.4-.38-3.04-1.13-.63-.75-.95-1.68-.95-2.76v-126.7Z"
            />
            <path d="m554.14,104.21c0-1.21.33-2.18,1-2.9.67-.73,1.67-1.09,3-1.09h24c1.03,0,1.98.36,2.86,1.09.88.72,1.32,1.69,1.32,2.9v21.93c0,1.09-.35,2.05-1.04,2.9-.7.85-1.74,1.27-3.13,1.27h-24c-2.67,0-4-1.39-4-4.17v-21.93Zm0,72.05c0-1.21.33-2.17,1-2.9.67-.73,1.67-1.09,3-1.09h24c1.03,0,1.98.36,2.86,1.09.88.72,1.32,1.69,1.32,2.9v21.93c0,1.09-.35,2.05-1.04,2.9-.7.85-1.74,1.27-3.13,1.27h-24c-2.67,0-4-1.39-4-4.17v-21.93Z" />
            <path d="m632.63,225.29c-.61,1.03-1.39,1.62-2.36,1.77-.97.15-1.9-.11-2.81-.77l-21.57-13.41c-.97-.67-1.51-1.48-1.63-2.45-.12-.97.12-1.87.72-2.72,6.83-10.88,12.02-22.39,15.59-34.53,3.32-11.96,4.99-24.56,4.99-37.79s-1.69-25.69-5.08-37.75-8.55-23.61-15.5-34.67c-.6-.78-.85-1.66-.72-2.63.12-.97.66-1.78,1.63-2.45l21.57-13.41c.91-.73,1.84-1,2.81-.82.97.18,1.75.79,2.36,1.81,8.34,13.17,14.71,27.3,19.12,42.37,4.41,15.08,6.62,30.92,6.62,47.54s-2.21,32.46-6.62,47.54c-4.41,15.08-10.79,29.2-19.12,42.37Z" />
          </g>
        </g>
      </svg>
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
          <svg
            id="Camada_2"
            data-name="Camada 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 73.06 128.62"
          >
            <g id="Camada_1-2" data-name="Camada 1">
              <path
                className="cls-1"
                d="m0,42.47c0-.85.23-1.52.7-2.03.47-.51,1.17-.76,2.1-.76h16.82c.72,0,1.39.25,2.01.76.62.51.92,1.19.92,2.03v15.37c0,.76-.24,1.44-.73,2.03-.49.59-1.22.89-2.2.89H2.8c-1.87,0-2.8-.97-2.8-2.92v-15.37Zm0,50.5c0-.85.23-1.52.7-2.03.47-.51,1.17-.76,2.1-.76h16.82c.72,0,1.39.25,2.01.76.62.51.92,1.19.92,2.03v15.37c0,.76-.24,1.44-.73,2.03-.49.59-1.22.89-2.2.89H2.8c-1.87,0-2.8-.97-2.8-2.92v-15.37Z"
              />
              <path
                className="cls-1"
                d="m55.01,127.35c-.42.72-.97,1.13-1.65,1.24-.68.11-1.33-.07-1.97-.54l-15.12-9.4c-.68-.47-1.06-1.04-1.14-1.72-.08-.68.08-1.31.51-1.91,4.79-7.62,8.43-15.69,10.93-24.2,2.33-8.39,3.49-17.22,3.49-26.49s-1.19-18.01-3.56-26.46c-2.37-8.45-5.99-16.55-10.86-24.3-.42-.55-.59-1.16-.51-1.84.08-.68.47-1.25,1.14-1.71L51.39.61c.64-.51,1.29-.7,1.97-.57.68.13,1.23.55,1.65,1.27,5.84,9.23,10.31,19.13,13.4,29.7,3.09,10.57,4.64,21.67,4.64,33.32s-1.55,22.75-4.64,33.32c-3.09,10.57-7.56,20.47-13.4,29.7Z"
              />
            </g>
          </svg>
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
