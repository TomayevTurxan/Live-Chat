import { useEffect } from "react";

const useNotificationHandler = (
  currentChat,
  notifications,
  setNotifications
) => {
  useEffect(() => {
    if (currentChat?._id) {
      handleIsReadNotification();
    }
  }, [currentChat]);

  const handleIsReadNotification = () => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.chatId === currentChat._id ? { ...notif, isRead: true } : notif
      )
    );
  };

  return { handleIsReadNotification };
};

export default useNotificationHandler;
