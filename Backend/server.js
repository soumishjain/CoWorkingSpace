import 'dotenv/config'
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";

// 👇 ye tera socket middleware file hai
import { initSocket } from "./src/sockets/chat.socket.js";
import { setIO } from "./src/lib/socket.js";

console.log("🔐 JWT SECRET:", process.env.JWT_SECRET);

const server = http.createServer(app);

// 🔥 SOCKET INIT
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 🔐 SOCKET LOGIC + MIDDLEWARE ATTACH
initSocket(io);
setIO(io);



// 🔥 GLOBAL ERROR HANDLING
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});


// 🚀 START SERVER
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});