import React, { useState, useRef, useContext } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ArrowBack,
  Send,
  MoreVert,
  Logout,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import { usePostMessage } from "../../features/mutations";
import UserContext from "../../context/UserInfo";
import { useUser } from "../../context/contexts";
import { useRecipientUser } from "../../features/queries";
import WelcomeBox from "../../components/WelcomeBox";
import InputEmojiComponent from "../../components/InputEmokji";
import ChipOnline from "../../components/Chip";
import Notification from "./Notification";
import DarkMode from "../../components/DarkMode";
import DuoIcon from "@mui/icons-material/Duo";
import VideoCall from "./VideoCall";

const ChatConversation = ({ currentChat, onBackToChats, onMenuToggle }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const messageInputRef = useRef(null);
  const sendMessage = usePostMessage();
  const { userInfo, logout } = useUser();
  const { socket } = useContext(UserContext);
  const recipientId = currentChat?.members?.find((id) => id !== userInfo?._id);
  const { data: recipientUser } = useRecipientUser(recipientId);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const open = Boolean(anchorEl);

  const handleAvatarClick = () => {
    if (recipientUser?._id) {
      navigate(`/chat/user/${recipientUser?._id}`);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();

    if (socket) {
      socket.disconnect();
    }

    queryClient.clear();

    logout();
    navigate("/login");
  };

  const handleVideoCall = () => {
    setVideoCallOpen(true);
  };

  const handleCloseVideoCall = () => {
    setVideoCallOpen(false);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const messageData = {
      chatId: currentChat._id,
      senderId: userInfo._id,
      text: message.trim(),
      isRead: false,
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

  if (!currentChat || currentChat.length == 0) {
    return <WelcomeBox />;
  }

  if (!recipientUser) return null;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          position: { xs: "fixed", md: "static" },
          top: { xs: 0, md: "auto" },
          width: "100%",
          zIndex: { xs: 10, md: "auto" },
        }}
      >
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          gap={1}
          onClick={handleAvatarClick}
        >
          {isMobile && (
            <IconButton onClick={onBackToChats} sx={{ mr: 1 }} color="primary">
              <ArrowBack />
            </IconButton>
          )}

          <Avatar
            src={recipientUser?.avatar}
            sx={{
              mr: { xs: 1, md: 2 },
            }}
          >
            {recipientUser?.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                fontWeight: 600,
              }}
            >
              {recipientUser?.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <ChipOnline recipientUser={recipientUser} />
            </Box>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {isMobile && onMenuToggle && (
            <IconButton onClick={onMenuToggle} color="inherit">
              <MenuIcon />
            </IconButton>
          )}
          <IconButton
            onClick={handleVideoCall}
            color="inherit"
          >
            <DuoIcon />
          </IconButton>
          <Notification />
          <DarkMode />
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
          >
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
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
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <InputEmojiComponent
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            messageInputRef={messageInputRef}
          />
        </Box>

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
            height: { xs: "40px", md: "48px" },
            fontSize: { xs: "0.875rem", md: "1rem" },
            borderRadius: 3,
            px: { xs: 2, md: 3 },
          }}
        >
          {sendMessage.isPending ? "Sending..." : "Send"}
        </Button>
      </Box>

      {/* Video Call Modal */}
      <VideoCall
        open={videoCallOpen}
        onClose={handleCloseVideoCall}
        recipientUser={recipientUser}
      />
    </Box>
  );
};

export default ChatConversation;