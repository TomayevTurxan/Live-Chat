import { createContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        setUserChats,
        setIsUserChatsLoading,
        setUserChatsError,
        currentChat,
        setCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
