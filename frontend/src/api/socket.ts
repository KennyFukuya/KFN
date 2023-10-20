import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    const accessToken = localStorage.getItem("accessToken");

    socket = io("ws://localhost:80/", {
      auth: {
        token: `Bearer ${accessToken}`,
      },
    });
  }
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket connection has not been established.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
