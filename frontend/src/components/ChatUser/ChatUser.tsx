import React from "react";
import styled from "styled-components";
import UserBadge from "../UserBadge/UserBadge";
import colors from "../../constants/colors";

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
  color: ${colors.dark.secondary};
  font-size: 18px;
  font-weight: 500;
`;

const UserRecentMessage = styled.span`
  color: ${colors.dark.secondary};
  font-size: 14px;
`;

interface ChatUser {
  givenName: string;
  familyName: string;
  email: string;
  isActive: boolean;
}

function ChatUser({ givenName, familyName, email, isActive }: ChatUser) {
  const badgeLabel = givenName[0] + familyName[0];

  return (
    <ChatUserWrapper>
      <UserBadge isActive={isActive}>{badgeLabel}</UserBadge>
      <UserTextWrapper>
        <UserName>{`${givenName} ${familyName}`}</UserName>
        <UserRecentMessage>{email}</UserRecentMessage>
      </UserTextWrapper>
    </ChatUserWrapper>
  );
}

export default ChatUser;
