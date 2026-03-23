import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";

const server = http.createServer(app);

// 🔥 SOCKET INIT
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 🔥 GLOBAL ERROR HANDLING
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // ✅ join user room (for personal events)
  socket.on("join-user", (userId) => {
    if (!userId) return;
    socket.join(userId.toString());
    console.log(`User ${socket.id} joined user room ${userId}`);
  });

  // ✅ join department room (for leaderboard/chat)
  socket.on("join-department", (departmentId) => {
    if (!departmentId) return;
    socket.join(departmentId.toString());
    console.log(
      `Socket ${socket.id} joined department ${departmentId}`
    );
  });

  // 🔥 leave department (important cleanup)
  socket.on("leave-department", (departmentId) => {
    socket.leave(departmentId.toString());
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// 🔥 START SERVER
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});