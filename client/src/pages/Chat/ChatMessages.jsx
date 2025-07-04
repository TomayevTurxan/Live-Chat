import { LinearProgress, Box, Typography, Avatar } from "@mui/material";
import { useChatData, useUser } from "../../context/contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { useGetMessages } from "../../features/queries";
import UserContext from "../../context/UserInfo";

const ChatMessages = ({ currentChat }) => {
  const { userInfo } = useUser();
  const [messages, setMessages] = useState([]);
  const { notifications, setNotifications } = useChatData();
  const { data: fetchedMessages, isLoading } = useGetMessages(currentChat?._id);
  const { socket } = useContext(UserContext);
  const scroll = useRef();

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  //receive messages
  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  //scroll
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentChat?._id) {
      handleIsReadNotification();
    }
  }, [currentChat]);
  
  const isMyMessage = (message) => {
    return message.senderId === userInfo?._id;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleIsReadNotification = () => {
    const updatedNotifications = notifications.map((notif) => {
      if (notif.chatId === currentChat._id) {
        return { ...notif, isRead: true };
      }
      return notif;
    });
    setNotifications(updatedNotifications);
  };

  if (isLoading) return <LinearProgress />;

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 1,
      }}
    >
      {messages?.map((msg, index) => {
        const isMine = isMyMessage(msg);
        // const isLastMessage = index === messages.length - 1;

        return (
          <Box
            key={msg._id}
            ref={scroll}
            sx={{
              display: "flex",
              justifyContent: isMine ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              gap: 1,
              mb: 1,
            }}
          >
            {!isMine && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                }}
              >
                {msg.senderName?.charAt(0) || "U"}
              </Avatar>
            )}

            <Box
              sx={{
                maxWidth: "70%",
                minWidth: "100px",
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isMine ? "primary.main" : "grey.100",
                color: isMine ? "grey.100" : "primary.main",
                borderBottomRightRadius: isMine ? 4 : 16,
                borderBottomLeftRadius: isMine ? 16 : 4,
                boxShadow: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-word",
                  lineHeight: 1.4,
                }}
              >
                {msg.text}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  opacity: 0.7,
                  fontSize: "0.7rem",
                  display: "block",
                  textAlign: isMine ? "right" : "left",
                  mt: 0.5,
                }}
              >
                {formatTime(msg.createdAt)}
              </Typography>
            </Box>

            {isMine && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "secondary.main",
                }}
              >
                {userInfo?.name?.charAt(0) || "M"}
              </Avatar>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ChatMessages;
