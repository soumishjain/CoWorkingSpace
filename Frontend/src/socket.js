import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
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