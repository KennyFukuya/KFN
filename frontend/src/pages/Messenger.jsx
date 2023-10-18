import React from "react";

import MessengerSideBar from "../components/MessengerSideBar/MessengerSideBar";
import MessageBox from "../components/MessageBox/MessageBox";
import styled from "styled-components";
import colors from "../constants/colors";

const MessengerWrapper = styled.div`
  display: flex;
  width: 1000px;
  height: 800px;
  border: 1px solid ${colors.dark.border};
  border-radius: 5px;
  box-shadow: 0px 0px 10px 7px ${colors.dark.border};
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
