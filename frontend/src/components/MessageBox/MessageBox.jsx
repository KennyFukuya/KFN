import React from "react";
import styled from "styled-components";
import UserBadge from "../UserBadge/UserBadge.ts";
import colors from "../../constants/colors.js";

// https://marella.me/material-icons/demo/
// https://dribbble.com/shots/3144274-Chat-module-UI-Challenge-Week-06/attachments/666341

const MessageBoxWrapper = styled.div`
  flex-basis: 70%;
  display: flex;
  flex-direction: column;
`;

const ActiveConversationHeaderSection = styled.section`
  background-color: ${colors.light.white};
  font-weight: 400;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 40px;
  border-radius: 0 4px 0 0;
`;

const ActiveConversationContentSection = styled.section`
  background-color: ${colors.light.gray};
  font-weight: 400;
  min-height: 640px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 40px;
`;

const ActiveConversationInputSection = styled.section`
  background-color: ${colors.light.white};
  font-weight: 400;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 40px;
  border-radius: 0 0 4px 0;
`;

const UserName = styled.span`
  color: ${colors.dark.black};
  font-size: 20px;
  font-weight: 500;
`;

const MessageInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
`;

function MessageBox() {
  // const [message, setMessage] = useState();

  // useEffect(() => {
  //   fetch("/api/")
  //     .then(res => res.json())
  //     .then(res => setMessage(res.message))
  //     .catch(console.error);
  // }, [setMessage]);

  return (
    <MessageBoxWrapper>
      <ActiveConversationHeaderSection>
        <UserBadge isActive={true} hasShadow={true}>
          KF
        </UserBadge>
        <UserName>Kenny Fukuya</UserName>
      </ActiveConversationHeaderSection>
      <ActiveConversationContentSection></ActiveConversationContentSection>
      <ActiveConversationInputSection>
        <MessageInput placeholder="Send a message" />
        <span class="material-icons">send</span>
      </ActiveConversationInputSection>
    </MessageBoxWrapper>
  );
}

export default MessageBox;
