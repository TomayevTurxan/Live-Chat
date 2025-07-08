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
    const updatedNotifications = notifications.map((notif) => {
      if (notif.chatId === currentChat._id) {
        return { ...notif, isRead: true };
      }
      return notif;
    });
    setNotifications(updatedNotifications);
  };

  return { handleIsReadNotification };
};

export default useNotificationHandler;
