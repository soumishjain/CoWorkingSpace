import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
  getChatRoomsAPI,
  createChatRoomAPI,
  deleteChatRoomAPI,
  addMembersToChatRoomAPI,
  removeMembersFromChatRoomAPI,
} from "../api/chatroom.api.js";

export const useChatrooms = () => {
  const { workspaceId, departmentId } = useParams();

  const [rooms, setRooms] = useState([]);
  const [plan, setPlan] = useState({});
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ROOMS ================= */
  const fetchRooms = useCallback(async () => {
    if (!workspaceId || !departmentId) return;

    try {
      setLoading(true);

      const res = await getChatRoomsAPI({
        workspaceId,
        departmentId,
      });

      console.log("📦 CHATROOM API RESPONSE:", res);

      if (res.success) {
        setRooms(res.chatRooms || []);
        setPlan(res.meta?.plan || {});
        setRole(res.meta?.role || "member");
      }
    } catch (error) {
      console.error("💥 fetchRooms ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, departmentId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  /* ================= FEATURE HELPERS ================= */

  const hasFeature = (featureKey) => {
    return Boolean(plan?.features?.[featureKey]);
  };

  const checkFeature = (allowed) => {
    if (allowed === false) {
      alert("This feature is not supported in your plan");
      return false;
    }
    return true;
  };

  /* ================= CREATE ROOM ================= */
  const createRoom = async (name) => {
    if (!name?.trim()) return;

    // 🔥 FIX 1: feature check hata diya (kyuki exist hi nahi karta)
    // instead limit check use karenge

    const maxRooms =
      plan?.limits?.chatroomsPerDepartment || Infinity;

    if (rooms.length >= maxRooms) {
      alert(
        `You can only create ${maxRooms} chat rooms in your plan`
      );
      return;
    }

    try {
      const res = await createChatRoomAPI({
        workspaceId,
        departmentId,
        name,
      });

      if (res.success) {
        setRooms((prev) => [...prev, res.chatRoom]);

        return res; // 🔥 IMPORTANT (for modal auto open)
      } else {
        // alert(res.error);
        return res;
      }
    } catch (error) {
      console.error("💥 createRoom ERROR:", error);
    }
  };

  /* ================= DELETE ROOM ================= */
  const deleteRoom = async (chatRoomId) => {
    try {
      const res = await deleteChatRoomAPI({
        workspaceId,
        departmentId,
        chatRoomId,
      });

      if (res.success) {
        setRooms((prev) =>
          prev.filter((room) => room._id !== chatRoomId)
        );
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error("💥 deleteRoom ERROR:", error);
    }
  };

  /* ================= ADD MEMBERS ================= */
  const addMembers = async (chatRoomId, members) => {

    try {
      const res = await addMembersToChatRoomAPI({
        workspaceId,
        departmentId,
        chatRoomId,
        members,
      });

      if (res.success) {
        setRooms((prev) =>
          prev.map((room) =>
            room._id === chatRoomId ? res.chatRoom : room
          )
        );
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error("💥 addMembers ERROR:", error);
    }
  };

  /* ================= REMOVE MEMBERS ================= */
const removeMembers = async (chatRoomId, memberId) => {
  try {
    const res = await removeMembersFromChatRoomAPI({
      workspaceId,
      departmentId,
      chatRoomId,
      memberId, // ✅ single
    });

    if (res.success) {
      setRooms((prev) =>
        prev.map((room) =>
          room._id === chatRoomId ? res.chatRoom : room
        )
      );
    } else {
      alert(res.error);
    }
  } catch (error) {
    console.error("💥 removeMembers ERROR:", error);
  }
};

  return {
    rooms,
    plan,
    role,
    loading,

    fetchRooms,
    createRoom,
    deleteRoom,
    addMembers,
    removeMembers,

    hasFeature,
    checkFeature,
  };
};