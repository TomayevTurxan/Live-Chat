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
      const queryKey = keys.getMessages(res.chatId);

      const prevMessages = queryClient.getQueryData(queryKey);

      if (prevMessages) {
        queryClient.setQueryData(queryKey, (old = []) => [...old, { ...res }]);
      } else {
        queryClient.setQueryData(queryKey, [{ ...res }]);
      }

      queryClient.invalidateQueries({
        queryKey: keys.getWithLastMessage(userInfo._id),
      });

      // Auto mark as read if user is currently in this chat
      if (currentChat?._id === res.chatId) {
        socket.emit("markAsRead", {
          chatId: res.chatId,
          userId: userInfo._id,
        });
      }
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

    const handleGetNotification = (res) => {
      if (currentChat?._id === res.chatId) {
        messageAudio.play();
      } else {
        notificationAudio.play();
        setNotifications((prev) => [res, ...prev]);
      }
    };

    socket.on("getMessage", handleGetMessage);
    socket.on("getNotification", handleGetNotification);
    socket.on("getMessagesRead", handleGetMessagesRead);
    socket.on("messageDeleted", handleDeleteMessage);
    socket.on("messageEdited", handleMessageEdited);

    return () => {
      socket.off("getMessage", handleGetMessage);
      socket.off("getNotification", handleGetNotification);
      socket.off("getMessagesRead", handleGetMessagesRead);
      socket.off("messageDeleted", handleDeleteMessage);
      socket.off("messageEdited", handleMessageEdited);
    };
  }, [socket, queryClient, currentChat, userInfo, setNotifications, messageAudio, notificationAudio]);

  useEffect(() => {
    if (!socket || !currentChat || !userInfo) return;

    socket.emit("markAsRead", {
      chatId: currentChat._id,
      userId: userInfo._id,
    });
  }, [currentChat?._id, socket, userInfo]);
};

export default useSocketHandlers;