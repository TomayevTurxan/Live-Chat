import { useEffect } from "react";
import { keys } from "../features/queries";
import { useQueryClient } from "@tanstack/react-query";
import notificationSound from "../../public/mixkit-correct-answer-tone-2870.wav";
import messageSound from "../../public/mixkit-message-pop-alert-2354.mp3";

const useSocketHandlers = (socket, currentChat, userInfo, setNotifications) => {
  const queryClient = useQueryClient();
  const messageAudio = new Audio(messageSound);
  const notificationAudio = new Audio(notificationSound);

  useEffect(() => {
    if (!socket) return;

    const handleGetMessage = (res) => {
      if (currentChat?._id === res.chatId) {
        queryClient.setQueryData(
          keys.getMessages(currentChat._id),
          (old = []) => [...old, { ...res }]
        );
        messageAudio.play()
      } else {
        notificationAudio.play();
        setNotifications((prev) => [res, ...prev]);
      }

      queryClient.setQueryData(
        keys.getWithLastMessage(userInfo._id),
        (old = []) => {
          const updated = old.map((chat) =>
            chat.chatId === res.chatId
              ? {
                  ...chat,
                  lastMessage: {
                    ...res,
                    isRead: currentChat?._id === res.chatId,
                  },
                }
              : chat
          );

          const exists = old.some((chat) => chat.chatId === res.chatId);
          if (!exists) {
            updated.push({
              chatId: res.chatId,
              members: [res.senderId, userInfo._id],
              lastMessage: { ...res, isRead: currentChat?._id === res.chatId },
            });
          }

          return updated;
        }
      );
    };

    const handleGetMessagesRead = ({ chatId }) => {
      if (currentChat?._id !== chatId) return;
      queryClient.setQueryData(keys.getMessages(chatId), (old = []) =>
        old.map((msg) =>
          msg.chatId === chatId ? { ...msg, isRead: true } : msg
        )
      );

      queryClient.invalidateQueries({
        queryKey: keys.getWithLastMessage(userInfo._id),
      });
    };
    const handleDeleteMessage = ({ messageId, chatId }) => {
      if (currentChat?._id !== chatId) return;
      queryClient.setQueryData(keys.getMessages(chatId), (old = []) =>
        old.filter((msg) => msg._id !== messageId)
      );
      queryClient.invalidateQueries({
        queryKey: keys.getWithLastMessage(userInfo._id),
      });
    };

    const handleMessageEdited = ({ message, chatId }) => {
      if (currentChat?._id !== chatId) return;

      queryClient.setQueryData(keys.getMessages(chatId), (old = []) =>
        old.map((msg) =>
          msg._id === message._id ? { ...msg, text: message.text } : msg
        )
      );

      queryClient.invalidateQueries({
        queryKey: keys.getWithLastMessage(userInfo._id),
      });
    };
    socket.on("getMessage", handleGetMessage);
    // socket.on("getNotification", handleGetNotification);
    socket.on("getMessagesRead", handleGetMessagesRead);
    socket.on("messageDeleted", handleDeleteMessage);
    socket.on("messageEdited", handleMessageEdited);

    return () => {
      socket.off("getMessage", handleGetMessage);
      // socket.off("getNotification", handleGetNotification);
      socket.off("getMessagesRead", handleGetMessagesRead);
      socket.off("messageDeleted", handleDeleteMessage);
      socket.off("messageEdited", handleMessageEdited);
    };
  }, [socket, currentChat, userInfo, setNotifications, queryClient]);

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
  }, [currentChat?._id]);
};

export default useSocketHandlers;
