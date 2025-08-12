import { createContext, useEffect, useState } from "react";
import { safeParse } from "../utils/safeParse";
const ChatDataContext = createContext();
export const ChatDataProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() =>
    safeParse("notifications", [])
  );
  const [currentChat, setCurrentChat] = useState(() =>
    safeParse("currentChat", null)
  );
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    const storedCurrentChat = localStorage.getItem("currentChat");

    if (storedNotifications !== JSON.stringify(notifications)) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
    if (storedCurrentChat !== JSON.stringify(currentChat)) {
      localStorage.setItem("currentChat", JSON.stringify(currentChat));
    }
  }, [notifications, currentChat]);

  return (
    <ChatDataContext.Provider
      value={{
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
