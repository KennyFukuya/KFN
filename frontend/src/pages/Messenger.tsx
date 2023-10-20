import React from "react";
import styled from "styled-components";

// import MessengerSideBar from "../components/MessengerSideBar/MessengerSideBar";
import MessageBox from "../components/MessageBox/MessageBox";
import colors from "../constants/colors";

const MessengerWrapper = styled.div`
  display: flex;
  width: 700px;
  height: 700px;
  border: 1px solid ${colors.dark.border};
  border-radius: 5px;
  box-shadow: 0px 0px 10px 7px ${colors.dark.border};
`;

export interface Topic {
  name: string;
  id: string;
}

function Messenger() {
  // const [activeTopic, setActiveTopic] = useState<Topic>();

  return (
    <MessengerWrapper>
      {/* <MessengerSideBar setActiveTopic={setActiveTopic} /> */}
      <MessageBox />
    </MessengerWrapper>
  );
}

export default Messenger;
