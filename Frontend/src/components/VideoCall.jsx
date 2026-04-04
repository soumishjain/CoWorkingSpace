import { useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = ({ chatRoomId, userId }) => {

  useEffect(() => {
    const initCall = async () => {
      const res = await fetch(`/api/zego/token?chatRoomId=${chatRoomId}`);
      const data = await res.json();

      const zp = ZegoUIKitPrebuilt.create(data.token);

      zp.joinRoom({
        container: document.getElementById("video-call"),
        sharedLinks: [
          {
            name: "Copy Link",
            url: window.location.href
          }
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall
        },
        roomID: chatRoomId,
        userID: userId,
        userName: "User"
      });
    };

    initCall();
  }, []);

  return <div id="video-call" style={{ width: "100%", height: "100vh" }} />;
};

export default VideoCall;