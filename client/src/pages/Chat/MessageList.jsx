import { Box, LinearProgress } from "@mui/material";
import { useRef, useContext, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import UserContext from "../../context/UserInfo";
import { useDeleteMessage } from "../../features/mutations";
import { useGetMessages } from "../../features/queries";

const MessagesList = ({ userInfo, currentChat }) => {
  const scroll = useRef();
  const { data: messages, isLoading } = useGetMessages(currentChat?._id);

  const { socket } = useContext(UserContext);
  const deleteMessage = useDeleteMessage();

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
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  if (isLoading) return <LinearProgress />;

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        pr: 4,
        pl: 4,
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
