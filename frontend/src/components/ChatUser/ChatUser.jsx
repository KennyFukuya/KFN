import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "../../constants/fonts.js";
import UserBadge from "../UserBadge/UserBadge.ts";

const ChatUserWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const UserTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const UserName = styled.span`
  color: ${colors.light.gray};
  font-size: 20px;
  font-weight: 500;
`;

const UserRecentMessage = styled.span`
  color: ${colors.light.gray};
  font-size: 14px;
  font-weight: ${props => props.isNew ? 400 : 300};
`;

function ChatUser() {
  // const [message, setMessage] = useState();

  // useEffect(() => {
  //   fetch("/api/")
  //     .then(res => res.json())
  //     .then(res => setMessage(res.message))
  //     .catch(console.error);
  // }, [setMessage]);

  return (
    <ChatUserWrapper>
      <UserBadge isActive={true}>KF</UserBadge>
      <UserTextWrapper>
        <UserName>Kenny Fukuya</UserName>
        <UserRecentMessage>Teste</UserRecentMessage>
      </UserTextWrapper>
    </ChatUserWrapper>
  );
}

export default ChatUser;
