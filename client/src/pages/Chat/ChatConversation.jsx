import React, { useState, useRef, useContext } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon, ArrowBack, Send } from "@mui/icons-material";
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
import { useEffect } from "react";

const ChatConversation = ({ currentChat, onBackToChats, onMenuToggle }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const messageInputRef = useRef(null);
  const sendMessage = usePostMessage();
  const { userInfo } = useUser();
  const { socket } = useContext(UserContext);
  const recipientId = currentChat?.members?.find((id) => id !== userInfo?._id);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const { data: recipientUser } = useRecipientUser(recipientId);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleAvatarClick = () => {
    if (recipientUser?._id) {
      navigate(`/chat/user/${recipientUser?._id}`);
    }
  };

  const handleVideoCall = () => {
    setVideoCallOpen(true);
  };

  const handleCloseVideoCall = () => {
    setVideoCallOpen(false);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    const messageData = {
      chatId: currentChat._id,
      senderId: userInfo._id,
      text: message.trim(),
      isRead: false,
    };
    return sendMessage.mutateAsync(messageData, {
      onSuccess: () => {
        queryClient.invalidateQueries(["messages"]);

        socket.emit("sendMessage", {
          ...messageData,
          recipientId,
        });
      },
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      setIncomingCallData(data);
      setVideoCallOpen(true);
    };

    socket.on("callUser", handleIncomingCall);

    return () => {
      socket.off("callUser", handleIncomingCall);
    };
  }, [socket]);

  if (!currentChat || currentChat.length == 0) {
    return <WelcomeBox />;
  }

  if (!recipientUser) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
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
          <IconButton onClick={handleVideoCall} color="inherit">
            <DuoIcon />
          </IconButton>
          <Notification />
          <DarkMode />
        </Box>
      </Box>

      <ChatMessages currentChat={currentChat} recipientId={recipientId} />

      <InputEmojiComponent
        handleSendMessage={handleSendMessage}
        messageInputRef={messageInputRef}
      />

      <VideoCall
        open={videoCallOpen}
        onClose={handleCloseVideoCall}
        recipientUser={recipientUser}
        incomingCallData={incomingCallData}
        setIncomingCallData={setIncomingCallData}
      />
    </Box>
  );
};

export default ChatConversation;
