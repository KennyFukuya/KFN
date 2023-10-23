import React, { KeyboardEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
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

  &.active {
    border-width: 8px;
    border-color: ${colors.light.green};
    border-style: dashed;
    outline: none;
    transition: border-width 0.2s ease-in-out;
  }
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

  > img {
    max-width: 300px;
    max-height: 300px;
  }

  > :last-child {
    font-size: 12px;
    place-self: end;
    margin-top: 10px;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logoutConnection = async () => await api.post("/auth/logout");

interface Message {
  message: string;
  timestamp: number;
  name: string;
  email: string;
  type: string;
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
    if (confirm("Are you want to log out?")) {
      mutate();
    }
  };

  const sendMessage = () => {
    const socket = getSocket();

    socket.emit("message", {
      message,
      name: `${userData.given_name} ${userData.family_name}`,
      email: userData.email,
      timestamp: Date.now(),
      type: "text",
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

      if (m.type == "file") {
        return (
          <MessageWrapper self={m.email === userData.email}>
            <img src={m.message} draggable={false} />
            <span>
              {m.name} - {dateString}
            </span>
          </MessageWrapper>
        );
      }

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

  const uploadFile = (file: File) => {
    const socket = getSocket();

    const reader = new FileReader();

    reader.onload = () => {
      const fileData = reader.result;

      socket.emit("message", {
        message: fileData,
        name: `${userData.given_name} ${userData.family_name}`,
        email: userData.email,
        timestamp: Date.now(),
        type: "file",
      });
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) {
      alert(
        "Files not supported. Only supports .jpeg and .png under 1M (max of 5 at a time)."
      );
    } else {
      acceptedFiles.forEach((file) => uploadFile(file));
    }
  };

  const onClickDrag = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxSize: 1000000, // 1MB
  });

  return (
    <MessageBoxWrapper>
      <ActiveConversationHeaderSection>
        <span>Users {onlineCount}/100</span>
        <LogoutButton onClick={handleLogout}>
          <span className="material-icons">logout</span>
        </LogoutButton>
      </ActiveConversationHeaderSection>
      <ActiveConversationContentSection
        {...getRootProps({
          onClick: onClickDrag,
          className: isDragActive ? "active" : "",
        })}
      >
        <input {...getInputProps()} />
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
