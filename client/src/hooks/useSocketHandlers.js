import { useEffect } from "react";
import { keys } from "../features/queries";
import { useQueryClient } from "@tanstack/react-query";

const useSocketHandlers = (
  socket,
  currentChat,
  userInfo,
  setMessages,
  setNotifications
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleGetMessage = (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
      queryClient.invalidateQueries({
        queryKey: keys.getWithLastMessage(userInfo._id),
      });
    };

    const handleGetNotification = (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    };

    socket.on("getMessage", handleGetMessage);
    socket.on("getNotification", handleGetNotification);

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [
    socket,
    currentChat,
    userInfo,
    setMessages,
    setNotifications,
    queryClient,
  ]);
};

export default useSocketHandlers;
