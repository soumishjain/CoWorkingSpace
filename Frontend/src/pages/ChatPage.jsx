import MainLayout from "../components/MainLayout";
import { ChatProvider } from "../context/ChatContext";

const ChatPage = () => {
  return (
    <ChatProvider>
      <div className="fixed inset-0 z-10">
        <MainLayout />
      </div>
    </ChatProvider>
  );
};

export default ChatPage;