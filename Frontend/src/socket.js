import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    const token = localStorage.getItem("token");

    console.log("🔑 TOKEN:", token);

    socket.auth = { token }; // 🔥 THIS IS KEY

    socket.connect();
  }
};