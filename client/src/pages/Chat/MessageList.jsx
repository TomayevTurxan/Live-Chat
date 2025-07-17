import { Box } from "@mui/material";
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

const MessagesList = ({ messages, userInfo }) => {
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isMyMessage = (message) => {
    return message.senderId === userInfo?._id;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
      {messages?.map((msg, idx) => (
        <MessageBubble
          key={idx}
          message={msg}
          isMyMessage={isMyMessage(msg)}
          userInfo={userInfo}
          formatTime={formatTime}
        />
      ))}
      <div ref={scroll} />
    </Box>
  );
};

export default MessagesList;
