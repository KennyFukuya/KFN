import React from "react";
// import Messenger from "./pages/Messenger";
import Login from "./pages/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import styled from "styled-components";
import colors from "./constants/colors";
// import colors from "./constants/colors";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
  min-height: 800px;
  min-width: 1000px;
  padding: 40px;
  background: ${colors.dark.secondary};
  background: linear-gradient(
    145deg,
    ${colors.dark.secondary} 40%,
    ${colors.dark.purple} 0%
  );
`;

function App() {
  // const [message, setMessage] = useState();
  // useEffect(() => {
  //   fetch("/api/")
  //     .then((res) => res.json())
  //     .then((res) => setMessage(res.message))
  //     .catch(console.error);
  // }, [setMessage]);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID as string}>
        <AppWrapper>
          {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message || "Loading..."}</p>
        <p>
          Edit <code>src/App.js</nocode> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

          <Login />

          {/* <Messenger /> */}
        </AppWrapper>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
