import { createContext, useEffect, useState } from "react";
import { useAllUsers, useUserChats } from "../features/queries";
import { useUser } from "./contexts";

const ChatDataContext = createContext();

export const ChatDataProvider = ({ children }) => {
  const { userInfo } = useUser();
  const { data: allUsers, isLoading: loadingUsers } = useAllUsers();
  const { data: userChats, isLoading: loadingChats } = useUserChats(
    userInfo?._id
  );

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentChat, setCurrentChat] = useState(() => {
    const saved = localStorage.getItem("currentChat");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentChat) {
      localStorage.setItem("currentChat", JSON.stringify(currentChat));
    } else {
      localStorage.removeItem("currentChat");
    }
  }, [currentChat]);

  return (
    <ChatDataContext.Provider
      value={{
        allUsers,
        userChats,
        loading: loadingUsers || loadingChats,
        notifications,
        setNotifications,
        currentChat,
        setCurrentChat,
      }}
    >
      {children}
    </ChatDataContext.Provider>
  );
};

export default ChatDataContext;
