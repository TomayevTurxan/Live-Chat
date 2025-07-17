import { Box, Typography, Avatar } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const MessageBubble = ({ message, isMyMessage, userInfo, formatTime }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMyMessage ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 1,
        mb: 1,
      }}
    >
      {!isMyMessage && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
          }}
        >
          {message.senderName?.charAt(0) || "U"}
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: "70%",
          minWidth: "100px",
          p: 1.5,
          borderRadius: 2,
          backgroundColor: isMyMessage ? "primary.main" : "grey.100",
          color: isMyMessage ? "grey.100" : "primary.main",
          borderBottomRightRadius: isMyMessage ? 4 : 16,
          borderBottomLeftRadius: isMyMessage ? 16 : 4,
          boxShadow: 1,
          position: "relative",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            wordBreak: "break-word",
            lineHeight: 1.4,
          }}
        >
          {message.text}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            opacity: 0.7,
            fontSize: "0.7rem",
            display: "block",
            textAlign: isMyMessage ? "right" : "left",
            mt: 0.5,
          }}
        >
          {formatTime(message.createdAt)}
        </Typography>

        {isMyMessage && (
          <Box
            sx={{
              position: "absolute",
              bottom: 4,
              right: 4,
              display: "flex",
              alignItems: "center",
              gap: 0.3,
            }}
          >
            {message.isRead ? (
              <DoneAllIcon sx={{ fontSize: 18, color: "#4fc3f7" }} />
            ) : (
              <DoneIcon sx={{ fontSize: 18, color: "grey" }} />
            )}
          </Box>
        )}
      </Box>

      {isMyMessage && (
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
};

export default MessageBubble;
