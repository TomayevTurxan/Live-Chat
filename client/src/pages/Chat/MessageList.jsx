import { Box, LinearProgress } from "@mui/material";
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { useGetMessages } from "../../features/queries";

const MessagesList = ({ userInfo, currentChat, onEditMessage }) => {
  const scroll = useRef();
  const { data: messages, isLoading } = useGetMessages(currentChat?._id);

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
          onEditMessage={onEditMessage}
        />
      ))}
      <div ref={scroll} />
    </Box>
  );
};

export default MessagesList;
