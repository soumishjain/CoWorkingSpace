import { io } from "socket.io-client";

export const socket = io(process.env.PORT, {
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