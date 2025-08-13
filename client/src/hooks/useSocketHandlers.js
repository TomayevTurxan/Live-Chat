import { useCallback, useEffect, useRef } from "react";
import { keys } from "../features/queries";
import { useQueryClient } from "@tanstack/react-query";
import notificationSound from "../../public/mixkit-correct-answer-tone-2870.wav";
import messageSound from "../../public/mixkit-message-pop-alert-2354.mp3";

const useSocketHandlers = (socket, currentChat, userInfo, setNotifications) => {
  const queryClient = useQueryClient();

  const messageAudioRef = useRef(null);
  const notificationAudioRef = useRef(null);

  useEffect(() => {
    if (!messageAudioRef.current) {
      messageAudioRef.current = new Audio(messageSound);
      messageAudioRef.current.preload = "auto";
    }
    if (!notificationAudioRef.current) {
      notificationAudioRef.current = new Audio(notificationSound);
      notificationAudioRef.current.preload = "auto";
    }

    return () => {
      if (messageAudioRef.current) {
        messageAudioRef.current.pause();
        messageAudioRef.current.currentTime = 0;
      }
      if (notificationAudioRef.current) {
        notificationAudioRef.current.pause();
        notificationAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  const playAudio = useCallback((audioRef) => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Audio oynatma xətası:", error);
          });
        }
      } catch (error) {
        console.error("Audio oynatma xətası:", error);
      }
    }
  }, []);

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


      if (currentChat?._id === res.chatId && res.senderId !== userInfo._id) {
        socket.emit("markAsRead", {
          chatId: res.chatId,
          userId: userInfo._id,
        });

        playAudio(messageAudioRef);
      }
    };

    const handleGetNotification = (res) => {
      console.log("getNotification alındı:", res);
      console.log("currentChat?._id:", currentChat?._id);
      console.log("notification chatId:", res.chatId);

      if (currentChat?._id !== res.chatId) {
        playAudio(notificationAudioRef);
        setNotifications((prev) => [res, ...prev]);
        console.log("Notification əlavə olundu");
      } else {
        console.log("Hazırda həmin chat-dayam, notification göstərilmədi");
      }
    };

    const handleGetMessagesRead = ({ chatId }) => {
      console.log("getMessagesRead alındı:", chatId);
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
  }, [socket, queryClient, currentChat, userInfo, setNotifications, playAudio]);

  useEffect(() => {
    if (!socket || !currentChat || !userInfo) return;

    console.log("Chat dəyişdi, markAsRead göndərilir:", {
      chatId: currentChat._id,
      userId: userInfo._id,
    });

    socket.emit("markAsRead", {
      chatId: currentChat._id,
      userId: userInfo._id,
    });
  }, [currentChat?._id, socket, userInfo]);
};

export default useSocketHandlers;
