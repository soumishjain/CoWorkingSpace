import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
});

// 🔥 SAFE CONNECT
export const connectSocket = () => {
  if (!socket.connected) {
    console.log("🔌 CONNECTING SOCKET...");
    socket.connect();
  }
};