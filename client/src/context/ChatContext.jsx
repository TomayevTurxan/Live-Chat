import { createContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [userChats, setuUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(true);
  const [userChatsError, setUserChatsError] = useState(null);


  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        setuUserChats,
        setIsUserChatsLoading,
        setUserChatsError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
