import { useCallback, useEffect } from "react";

const useNotificationHandler = (
  currentChat,
  notifications,
  setNotifications
) => {
  const handleIsReadNotification = useCallback(() => {
    setNotifications((prev) =>
      prev?.map((notif) =>
        notif?.chatId === currentChat?._id ? { ...notif, isRead: true } : notif
      )
    );
  }, [currentChat?._id, setNotifications]);

  useEffect(() => {
    if (currentChat?._id) {
      handleIsReadNotification();
    }
  }, [currentChat?._id, handleIsReadNotification]);

  return { handleIsReadNotification };
};

export default useNotificationHandler;
