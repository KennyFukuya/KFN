import { GoogleLogin } from "@react-oauth/google";
import React from "react";

import styled from "styled-components";

const LoginWrapper = styled.div`
  display: flex;
  width: 1200px;
  height: 800px;
`;

function Login() {
  // const [message, setMessage] = useState();

  // useEffect(() => {
  //   fetch("/api/")
  //     .then(res => res.json())
  //     .then(res => setMessage(res.message))
  //     .catch(console.error);
  // }, [setMessage]);

  return (
    <LoginWrapper>
      <h1>Sign in</h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      ;
    </LoginWrapper>
  );
}

export default Login;
