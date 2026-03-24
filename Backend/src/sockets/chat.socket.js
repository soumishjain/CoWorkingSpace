import jwt from "jsonwebtoken";
import cookie from "cookie";

import departmentMemberModel from "../src/models/departmentMember.models.js";
import messageModel from "../src/models/message.models.js";

export const initSocket = (io) => {

  // ===== 🔐 AUTH MIDDLEWARE (COOKIE BASED) =====
io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers?.cookie;

    console.log("🍪 RAW COOKIE:", cookieHeader);

    if (!cookieHeader) {
      console.log("❌ NO COOKIE HEADER");
      return next(new Error("Unauthorized"));
    }

    const cookie = require("cookie");
    const cookies = cookie.parse(cookieHeader);

    console.log("🍪 PARSED COOKIES:", cookies);

    const token = cookies.token;

    console.log("🔑 TOKEN:", token);

    if (!token) {
      console.log("❌ TOKEN NOT FOUND");
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ DECODED:", decoded);

    socket.userId = decoded.userId;

    next();
  } catch (err) {
    console.log("❌ AUTH ERROR:", err.message);
    next(new Error("Unauthorized"));
  }
});



  // ===== 🔌 CONNECTION =====
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.userId);

    // ===== 🧠 JOIN DEPARTMENT =====
    socket.on("join_department", async (payload) => {
      try {
        const departmentId = payload?.departmentId;

        if (!departmentId) {
          console.log("❌ NO DEPARTMENT ID (JOIN)");
          return;
        }

        const member = await departmentMemberModel.findOne({
          userId: socket.userId,
          departmentId,
        });

        if (!member) {
          console.log("❌ JOIN FAILED - NOT MEMBER");
          return;
        }

        socket.join(departmentId.toString());

        console.log("✅ JOIN SUCCESS:", departmentId);

      } catch (e) {
        console.error("join_department error:", e);
      }
    });



    // ===== 🚪 LEAVE =====
    socket.on("leave_department", (payload) => {
      const departmentId = payload?.departmentId;

      if (!departmentId) return;

      socket.leave(departmentId.toString());

      console.log("🚪 LEFT:", departmentId);
    });



    // ===== 💬 SEND MESSAGE =====
    socket.on("send_message", async (payload) => {
      try {
        console.log("🔥 EVENT HIT:", payload);

        const content = payload?.content;
        const departmentId = payload?.departmentId;

        if (!content || !departmentId) {
          console.log("❌ INVALID PAYLOAD");
          return;
        }

        if (content.trim().length === 0) return;

        // 🔐 check membership
        const member = await departmentMemberModel.findOne({
          userId: socket.userId,
          departmentId,
        });

        if (!member) {
          console.log("❌ SEND FAILED - NOT MEMBER");
          return;
        }

        // 💾 save message
        const message = await messageModel.create({
          content: content.trim(),
          departmentId,
          senderId: socket.userId,
        });

        // 🔥 populate sender
        const populatedMessage = await messageModel
          .findById(message._id)
          .populate("senderId", "name profileImage");

        // 📡 emit to room
        io.to(departmentId.toString()).emit(
          "receive_message",
          populatedMessage
        );

        console.log("✅ MESSAGE SENT:", populatedMessage.content);

      } catch (e) {
        console.error("❌ send_message error:", e);
      }
    });



    // ===== ❌ DISCONNECT =====
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.userId);
    });
  });
};