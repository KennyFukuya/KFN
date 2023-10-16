import React, { useEffect, useState } from "react";

import MessengerSideBar from "../components/MessengerSideBar/MessengerSideBar";
import MessageBox from "../components/MessageBox/MessageBox";
import styled from "styled-components";

const MessengerWrapper = styled.div`
  display: flex;
  width: 1200px;
  height: 800px;
`;

function Messenger() {
  // const [message, setMessage] = useState();

  // useEffect(() => {
  //   fetch("/api/")
  //     .then(res => res.json())
  //     .then(res => setMessage(res.message))
  //     .catch(console.error);
  // }, [setMessage]);

  return (
    <MessengerWrapper>
      <MessengerSideBar />
      <MessageBox />
    </MessengerWrapper>
  );
}

export default Messenger;
