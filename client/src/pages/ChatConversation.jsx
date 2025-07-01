import { useState, useRef, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  useColorScheme,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import {
  LightMode,
  DarkMode as DarkModeIcon,
  Menu,
  ArrowBack,
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
} from "@mui/icons-material";
import ChatMessages from "./Chat/ChatMessages";
import InputEmoji from "react-input-emoji";

const ChatConversation = ({
  currentChat,
  onBackToChats,
  onMenuToggle,
  recipientInfo = { name: "Turkhan", status: "Online", avatar: null },
}) => {
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageInputRef = useRef(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleToggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
      messageInputRef.current?.focus();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  useEffect(() => {
    if (currentChat && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [currentChat]);

  if (!currentChat || currentChat.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          color: "text.secondary",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Welcome to Live Chat
        </Typography>
        <Typography variant="body2" align="center">
          Select a conversation to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: { xs: "60px", md: "80px" },
          backgroundColor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {isMobile && (
            <IconButton onClick={onBackToChats} sx={{ mr: 1 }} color="primary">
              <ArrowBack />
            </IconButton>
          )}

          <Avatar
            src={recipientInfo.avatar}
            sx={{
              mr: { xs: 1, md: 2 },
              width: { xs: 36, md: 44 },
              height: { xs: 36, md: 44 },
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            {recipientInfo.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                fontWeight: 600,
              }}
            >
              {recipientInfo.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={recipientInfo.status}
                size="small"
                color={
                  recipientInfo.status === "Online" ? "success" : "default"
                }
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
              {isTyping && (
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  typing...
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {isMobile && onMenuToggle && (
            <IconButton onClick={onMenuToggle} color="inherit">
              <Menu />
            </IconButton>
          )}
          <IconButton onClick={handleToggleTheme} color="inherit">
            {mode === "dark" ? <DarkModeIcon /> : <LightMode />}
          </IconButton>
          <IconButton color="inherit">
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "background.default",
          backgroundImage: `linear-gradient(45deg, ${theme.palette.background.default} 25%, transparent 25%), 
                           linear-gradient(-45deg, ${theme.palette.background.default} 25%, transparent 25%)`,
          backgroundSize: "20px 20px",
          p: { xs: 1, md: 2 },
        }}
      >
        <ChatMessages currentChat={currentChat} />
      </Box>

      <Box
        sx={{
          p: { xs: 1, md: 2 },
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <InputEmoji
            value={message}
            onChange={setMessage}
            onEnter={handleSendMessage}
            fontFamily="nunito"
            borderColor="rgba(72, 112, 223, 0.2)"
            cleanOnEnter
            placeholder="Type your message..."
          />

          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            startIcon={<Send />}
            sx={{
              order: 3,
              minWidth: { xs: "100%", sm: "auto" },
              height: { xs: "40px", md: "48px" },
              fontSize: { xs: "0.875rem", md: "1rem" },
              borderRadius: 3,
              px: { xs: 2, md: 3 },
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatConversation;
