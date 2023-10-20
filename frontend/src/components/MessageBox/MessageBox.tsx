import React, { KeyboardEvent, useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../constants/colors";
import { useMutation } from "react-query";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import useUserData from "../../hooks/useUserData";
import { connectSocket, disconnectSocket, getSocket } from "../../api/socket";
import useOnline from "../../hooks/useOnline";

const MessageBoxWrapper = styled.div`
  flex-basis: 100%;
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
  border-radius: 4px 4px 0 0;
  justify-content: space-between;

  > first-child {
    font-size: 14px;
  }
`;

const ActiveConversationContentSection = styled.section`
  background-color: ${colors.light.gray};
  font-weight: 400;
  height: 540px;
  display: flex;
  flex-direction: column-reverse;
  gap: 20px;
  padding: 20px 40px 20px 40px;
  overflow-y: auto;
`;

const ActiveConversationInputSection = styled.section`
  background-color: ${colors.light.white};
  font-weight: 400;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 40px;
  border-radius: 0 0 4px 4px;

  > span {
    cursor: pointer;
  }
`;

const MessageInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  > span {
    color: ${colors.dark.primary};
  }
`;

const MessageWrapper = styled.div<{ self: boolean }>`
  padding: 10px;
  background: ${(props) =>
    props.self ? colors.dark.primary : colors.dark.purple};
  color: ${(props) =>
    props.self ? colors.light.primary : colors.light.primary};
  display: flex;
  flex-direction: column;
  width: 300px;
  border-radius: 4px;
  place-self: ${(props) => (props.self ? "end" : "start")};

  > span {
    word-wrap: break-word;
  }

  > :last-child {
    font-size: 12px;
    place-self: end;
    margin-top: 10px;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logoutConnection = async () => await api.post("/auth/google/logout");

interface Message {
  message: string;
  timestamp: number;
  name: string;
  email: string;
}

function MessageBox() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const userData = useUserData();
  const { data: onlineCount } = useOnline();

  const [message, setMessage] = useState("");

  useEffect(() => {
    connectSocket();

    const socket = getSocket();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [data, ...prevMessages]);
    });

    return disconnectSocket;
  }, []);

  const { mutate } = useMutation(logoutConnection, {
    onSuccess: () => {
      localStorage.removeItem("oauth");
      localStorage.removeItem("accessToken");

      navigate("/");
    },
    onError: (err) => {
      localStorage.removeItem("oauth");
      localStorage.removeItem("accessToken");

      navigate("/");

      console.error(err);
    },
  });

  const handleLogout = () => {
    mutate();
  };

  const sendMessage = () => {
    const socket = getSocket();

    socket.emit("message", {
      message,
      name: userData.name,
      email: userData.email,
      timestamp: Date.now(),
    });

    setMessage("");
  };

  const onMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const renderMessages = () => {
    return messages.map((m) => {
      const date = new Date(m.timestamp);
      const dateString = date.toLocaleString();

      return (
        <MessageWrapper self={m.email === userData.email}>
          <span>{m.message}</span>
          <span>
            {m.name} - {dateString}
          </span>
        </MessageWrapper>
      );
    });
  };

  return (
    <MessageBoxWrapper>
      <ActiveConversationHeaderSection>
        <span>Users {onlineCount}/100</span>
        <LogoutButton onClick={handleLogout}>
          <span className="material-icons">logout</span>
        </LogoutButton>
      </ActiveConversationHeaderSection>
      <ActiveConversationContentSection>
        {renderMessages()}
      </ActiveConversationContentSection>
      <ActiveConversationInputSection>
        <MessageInput
          placeholder="Send a message"
          onChange={onMessageChange}
          onKeyDown={handleKeyDown}
          value={message}
        />
        <span className="material-icons" onClick={sendMessage}>
          send
        </span>
      </ActiveConversationInputSection>
    </MessageBoxWrapper>
  );
}

export default MessageBox;
