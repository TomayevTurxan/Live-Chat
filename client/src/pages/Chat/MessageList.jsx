import { Box } from "@mui/material";
import { useRef, useEffect, useContext } from "react";
import MessageBubble from "./MessageBubble";
import UserContext from "../../context/UserInfo";
import { useDeleteMessage } from "../../features/mutations";

const MessagesList = ({ messages, userInfo, setMessages }) => {
  const scroll = useRef();
  const { socket } = useContext(UserContext);
  const deleteMessage = useDeleteMessage();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isMyMessage = (message) => {
    return message.senderId === userInfo?._id;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, 
    });
  };

  const handleDeleteMessage = async (messageId, chatId) => {
    try {
      await deleteMessage.mutateAsync(messageId);
      socket.emit("deleteMessage", { messageId, chatId });
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

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
      {messages?.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isMyMessage={isMyMessage(msg)}
          userInfo={userInfo}
          formatTime={formatTime}
          onDeleteMessage={handleDeleteMessage}
        />
      ))}
      <div ref={scroll} />
    </Box>
  );
};

export default MessagesList;
