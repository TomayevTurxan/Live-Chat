import { useState, useRef, useContext } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
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
  MoreVert,
} from "@mui/icons-material";
import ChatMessages from "./Chat/ChatMessages";
import { usePostMessage } from "../features/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/contexts";
import { useRecipientUser } from "../features/queries";
import UserContext from "../context/UserInfo";
import WelcomeBox from "../components/WelcomeBox";
import DarkMode from "../components/DarkMode";
import InputEmojiComponent from "../components/InputEmokji";
import ChipOnline from "../components/Chip";

const ChatConversation = ({ currentChat, onBackToChats, onMenuToggle }) => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const messageInputRef = useRef(null);
  const sendMessage = usePostMessage();
  const { userInfo } = useUser();
  const { socket } = useContext(UserContext);

  const recipientId = currentChat?.members?.find((id) => id !== userInfo._id);
  const { data: recipientUser } = useRecipientUser(recipientId);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      chatId: currentChat._id,
      senderId: userInfo._id,
      text: message.trim(),
    };

    sendMessage.mutate(messageData, {
      onSuccess: () => {
        queryClient.invalidateQueries(["messages"]);
        setMessage("");
        messageInputRef.current?.focus();

        socket.emit("sendMessage", {
          ...messageData,
          recipientId,
        });
      },
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentChat || currentChat.length == 0) {
    return <WelcomeBox />;
  }

  if (!recipientUser) return null;

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
            src={recipientUser.avatar}
            sx={{
              mr: { xs: 1, md: 2 },
            }}
          >
            {recipientUser.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                fontWeight: 600,
              }}
            >
              {recipientUser.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <ChipOnline recipientUser={recipientUser} />
            </Box>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {isMobile && onMenuToggle && (
            <IconButton onClick={onMenuToggle} color="inherit">
              <Menu />
            </IconButton>
          )}
          <DarkMode />
          <IconButton color="inherit">
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <ChatMessages currentChat={currentChat} recipientId={recipientId} />

      <Box
        sx={{
          p: { xs: 1, md: 2 },
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          display: "flex",
        }}
      >
        <InputEmojiComponent
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          messageInputRef={messageInputRef}
        />

        <Button
          variant="contained"
          type="button"
          onClick={handleSendMessage}
          disabled={
            !message.trim() ||
            !currentChat?._id ||
            !userInfo?._id ||
            sendMessage.isPending
          }
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
          {sendMessage.isPending ? "Sending..." : "Send"}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatConversation;
