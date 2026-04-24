import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatroomSidebar from "./ChatroomSidebar";
import ChatWindow from "./ChatWindow";
import { useChatContext } from "../context/ChatContext";
import { useChatrooms } from "../hooks/useChatrooms";

const MainLayout = () => {
  const { activeChatRoom, setActiveChatRoom } = useChatContext();
  const { rooms } = useChatrooms();

  const { chatRoomId } = useParams();

  const [isMobile, setIsMobile] = useState(false);

  // 🔥 SCREEN DETECT
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 🔥 RESTORE ROOM
  useEffect(() => {
    if (!chatRoomId || rooms.length === 0) return;

    const room = rooms.find((r) => r._id === chatRoomId);

    if (room) {
      setActiveChatRoom(room);
    }
  }, [chatRoomId, rooms]);

  // ================= MOBILE =================
  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col">

        {!activeChatRoom ? (
          <ChatroomSidebar />
        ) : (
          <>
            {/* BACK */}
            <div
              className="p-3 border-b text-sm cursor-pointer"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setActiveChatRoom(null)}
            >
              ← Back
            </div>

            <div className="flex-1 min-h-0">
              <ChatWindow />
            </div>
          </>
        )}

      </div>
    );
  }

  // ================= DESKTOP =================
  return (
  <div className="flex w-full h-full overflow-hidden">

    {/* SIDEBAR */}
    <div className="w-72 flex-shrink-0 h-full border-r">
      <ChatroomSidebar />
    </div>

    {/* CHAT */}
    <div className="flex-1 h-full min-w-0">
      <ChatWindow />
    </div>

  </div>
);
};

export default MainLayout;