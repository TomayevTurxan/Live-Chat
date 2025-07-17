import { useEffect } from "react";
import { keys } from "../features/queries";
import { useQueryClient } from "@tanstack/react-query";
import notificationSound from "../../public/mixkit-correct-answer-tone-2870.wav";
import messageSound from "../../public/mixkit-message-pop-alert-2354.mp3";

const useSocketHandlers = (
  socket,
  currentChat,
  userInfo,
  setMessages,
  setNotifications
) => {
  const queryClient = useQueryClient();
  const messageAudio = new Audio(messageSound);
  const notificationAudio = new Audio(notificationSound);

  useEffect(() => {
    if (!socket) return;

    const handleGetMessage = (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, { ...res, isRead: true }]);
      messageAudio.play();

      queryClient.invalidateQueries({
        queryKey: keys.getWithLastMessage(userInfo._id),
      });

      socket.emit("markAsRead", {
        chatId: currentChat._id,
        userId: userInfo._id,
      });
    };

    const handleGetNotification = (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
        notificationAudio.play();
      }
    };

    const handleGetMessagesRead = ({ chatId }) => {
      if (currentChat?._id !== chatId) return;

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.chatId === chatId ? { ...msg, isRead: true } : msg
        )
      );
    };

    socket.on("getMessage", handleGetMessage);
    socket.on("getNotification", handleGetNotification);
    socket.on("getMessagesRead", handleGetMessagesRead);

    return () => {
      socket.off("getMessage", handleGetMessage);
      socket.off("getNotification", handleGetNotification);
      socket.off("getMessagesRead", handleGetMessagesRead);
    };
  }, [
    socket,
    currentChat,
    userInfo,
    setMessages,
    setNotifications,
    queryClient,
  ]);

  useEffect(() => {
    if (!socket || !currentChat || !userInfo) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        socket.emit("markAsRead", {
          chatId: currentChat._id,
          userId: userInfo._id,
        });
      }
    };

    const handleFocus = () => {
      socket.emit("markAsRead", {
        chatId: currentChat._id,
        userId: userInfo._id,
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [socket, currentChat, userInfo]);
};

export default useSocketHandlers;
