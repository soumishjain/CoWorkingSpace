import jwt from "jsonwebtoken";
import departmentMemberModel from "../../models/departmentMember.models.js";
import messageModel from "../../models/message.models.js";

export const initSocket = (io) => {

  // ===== 🔐 AUTH MIDDLEWARE =====
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded?.userId) return next(new Error("Unauthorized"));

      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  // ===== 🔌 CONNECTION =====
  io.on("connection", (socket) => {
    console.log("Connected:", socket.userId);

    // ===== 🧠 JOIN DEPARTMENT =====
    socket.on("join_department", async (payload) => {
      try {
        const departmentId = payload?.departmentId;
        if (!departmentId) return;

        const member = await departmentMemberModel.findOne({
          userId: socket.userId,
          departmentId,
        });

        if (!member) return;

        socket.join(departmentId.toString());
      } catch (e) {
        console.error("join_department error:", e);
      }
    });

    // ===== 🚪 LEAVE =====
    socket.on("leave_department", (payload) => {
      const departmentId = payload?.departmentId;
      if (!departmentId) return;

      socket.leave(departmentId.toString());
    });

    // ===== 💬 SEND MESSAGE =====
    socket.on("send_message", async (payload) => {
      try {
        const content = payload?.content;
        const departmentId = payload?.departmentId;

        if (!content || !departmentId) return;
        if (content.trim().length === 0) return;

        const member = await departmentMemberModel.findOne({
          userId: socket.userId,
          departmentId,
        });

        if (!member) return;

        const message = await messageModel.create({
          content: content.trim(),
          departmentId,
          senderId: socket.userId,
        });

        io.to(departmentId.toString()).emit("receive_message", message);
      } catch (e) {
        console.error("send_message error:", e);
      }
    });

    // ===== ❌ DISCONNECT =====
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.userId);
    });
  });
};