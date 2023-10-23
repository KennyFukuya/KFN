import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Messenger from "./pages/Messenger";
import Login from "./pages/Login";
import styled from "styled-components";
import colors from "./constants/colors";
import AuthChecker from "./components/AuthChecker/AuthChecker";
import Signup from "./pages/Signup";

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
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID as string}>
        <AppWrapper>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <AuthChecker redirect="/messenger">
                    <Login />
                  </AuthChecker>
                }
              />
              <Route
                path="/messenger"
                element={
                  <AuthChecker>
                    <Messenger />
                  </AuthChecker>
                }
              />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        </AppWrapper>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
