import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [activeChatRoom, setActiveChatRoom] = useState(null);

  return (
    <ChatContext.Provider value={{ activeChatRoom, setActiveChatRoom }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);