import React from "react";
import styled from "styled-components";
import ChatUser from "../ChatUser/ChatUser";

// import { SideBarWrapper } from "./styles";

// interface MyButtonProps {
//   /** The text to display inside the button */
//   title: string;
//   /** Whether the button can be interacted with */
//   disabled: boolean;
// }

const SideBarWrapper = styled.div`
  width: 500px;
  background: #2c2639;
  color: #949494;
  display: flex;
  flex-direction: column;
`;

const UsersSectionHeader = styled.h3`
  color: #949494;
  font-weight: 400;
`;

function MessengerSideBar() {
  // const [message, setMessage] = useState();

  // useEffect(() => {
  //   fetch("/api/")
  //     .then(res => res.json())
  //     .then(res => setMessage(res.message))
  //     .catch(console.error);
  // }, [setMessage]);

  return (
    <SideBarWrapper>
      <ChatUser></ChatUser>

      <section>
        <UsersSectionHeader>Users</UsersSectionHeader>
        <ChatUser />
      </section>
    </SideBarWrapper>
  );
}

export default MessengerSideBar;
