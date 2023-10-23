import React, { useId, useState } from "react";
import styled from "styled-components";

import colors from "../constants/colors";
import LoginInput from "../components/LoginInput/LoginInput";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const SignupWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30px;
  width: 320px;
  height: 520px;
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

const SignupButton = styled.button`
  color: ${colors.dark.secondary};
  width: 100%;
  padding: 10px 5px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  border: 1px solid ${colors.dark.secondary};
  background-color: ${colors.dark.search.background};
  margin-top: 40px;
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

function Signup() {
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formId = useId();
  const navigate = useNavigate();

  const handleGivenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGivenName(e.target.value);
  };

  const handleFamilyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFamilyName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      await api.post("/auth/signup", {
        givenName,
        familyName,
        email,
        password,
      });
      alert("User created");
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 409) {
          alert("User already exists");
        } else {
          alert("An error has occurred");
        }
      } else {
        alert("An error has occurred");
      }
    }
  };

  return (
    <SignupWrapper>
      <Heading>Sign up</Heading>

      <form id={formId} onSubmit={handleSubmit}>
        <InputWrapper>
          <LoginInput
            inputLabel="Given Name"
            inputType="text"
            iconName="account_circle"
            formId={formId}
            value={givenName}
            placeholder="Type your given name"
            onChange={handleGivenNameChange}
            required={true}
            inputName={"givenName"}
          />
        </InputWrapper>
        <InputWrapper>
          <LoginInput
            inputLabel="Family Name"
            inputType="text"
            iconName="account_circle"
            formId={formId}
            value={familyName}
            placeholder="Type your family name"
            onChange={handleFamilyNameChange}
            required={true}
            inputName={"familyName"}
          />
        </InputWrapper>

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

        <SignupButton type={"submit"} form={formId}>
          SIGN UP
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
        </SignupButton>
      </form>
    </SignupWrapper>
  );
}

export default Signup;
