import { createContext, useEffect, useState } from "react";
const ChatDataContext = createContext();
export const ChatDataProvider = ({ children }) => {
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
    localStorage.setItem("currentChat", JSON.stringify(currentChat));
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
