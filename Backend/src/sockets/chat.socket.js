import jwt from "jsonwebtoken";
import departmentMemberModel from "../models/departmentMember.models.js";
import messageModel from "../models/message.models.js";
import departmentModel from "../models/department.models.js";
import workspaceMemberModel from "../models/workspaceMember.models.js";

export const initSocket = (io) => {

  console.log("🔥 INIT SOCKET CALLED");
  console.log("SECRET IN SOCKET: ", process.env.JWT_SECRET)

  // ===== 🔐 AUTH MIDDLEWARE (AUTH TOKEN BASED) =====
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    console.log("🔑 TOKEN:", token);
    console.log("🔐 SECRET:", process.env.JWT_SECRET);

    if (!token) {
      console.log("❌ NO TOKEN");
      return next(new Error("No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ DECODED:", decoded);

    socket.userId = decoded.id;

    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message); // 🔥 MOST IMPORTANT
    next(new Error("Unauthorized"));
  }
});



  // ===== 🔌 CONNECTION =====
  io.on("connection", (socket) => {
    console.log("🟢 CONNECTED USER:", socket.userId);

    // ===== 🧠 JOIN DEPARTMENT =====
    socket.on("join_department", async ({ departmentId }) => {
      try {
        console.log("joinDepartment: ", departmentId)
        if (!departmentId) {
          console.log("❌ NO DEPARTMENT ID");
          return;
        }

        const member = await departmentMemberModel.findOne({
          userId: socket.userId,
          departmentId,
        });

        const department = await departmentModel.findById(departmentId)

        const workspaceId = department.workspaceId

        const admin = await workspaceMemberModel.findOne({workspaceId,userId: socket.userId, role : 'admin'})

        if (!admin && !member) {
          console.log("❌ NOT A MEMBER");
          return;
        }

        socket.join(departmentId.toString());

        console.log("✅ JOINED:", departmentId);
      } catch (err) {
        console.error("JOIN ERROR:", err);
      }
    });



    // ===== 🚪 LEAVE =====
    socket.on("leave_department", ({ departmentId }) => {
      if (!departmentId) return;

      socket.leave(departmentId.toString());

      console.log("🚪 LEFT:", departmentId);
    });



    // ===== 💬 SEND MESSAGE =====
socket.on("send_message", async ({ content, departmentId }) => {
  try {
    if (!content || !departmentId) return;
    if (!content.trim()) return;

    const department = await departmentModel.findById(departmentId);
    const workspaceId = department.workspaceId;

    // 🔥 check admin (workspace level)
    const admin = await workspaceMemberModel.findOne({
      workspaceId,
      userId: socket.userId,
      role: "admin",
    });

    // 🔥 check department member (manager bhi yahi hoga)
    const member = await departmentMemberModel.findOne({
      userId: socket.userId,
      departmentId,
    });

    if (!admin && !member) {
      console.log("❌ NOT AUTHORIZED");
      return;
    }

    // 🔥 role decide karo
    let role = "member";

    if (admin) {
      role = "admin";
    } else if (member?.role === "manager") {
      role = "manager";
    }

    console.log(role)

    const message = await messageModel.create({
      content: content.trim(),
      departmentId,
      senderId: socket.userId,
    });

    const populated = await messageModel
      .findById(message._id)
      .populate("senderId", "name profileImage");

    // 🔥 yaha attach kar role manually
    const messageWithRole = {
      ...populated.toObject(),
      role,
    };

    io.to(departmentId.toString()).emit("receive_message", messageWithRole);

  } catch (err) {
    console.error("SEND ERROR:", err);
  }
});


    // ===== ❌ DISCONNECT =====
    socket.on("disconnect", () => {
      console.log("🔴 DISCONNECTED:", socket.userId);
    });
  });
};