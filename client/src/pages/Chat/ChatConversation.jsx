import { useState, useRef, useContext } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon, ArrowBack, Send } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import UserContext from "../../context/UserInfo";
import { useUser } from "../../context/contexts";
import WelcomeBox from "../../components/WelcomeBox";
import InputEmojiComponent from "../../components/InputEmokji";
import ChipOnline from "../../components/Chip";
import Notification from "./Notification";
import DarkMode from "../../components/DarkMode";
import DuoIcon from "@mui/icons-material/Duo";
import VideoCall from "./VideoCall";
import { useEffect } from "react";
import { useBlockUser } from "../../features/mutations";
import UserDetail from "./UserDetail";
import { useRecipientUser } from "../../features/queries";

const ChatConversation = ({ currentChat, onBackToChats, onMenuToggle }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [userDetailDrawerOpen, setUserDetailDrawerOpen] = useState(false);
  const messageInputRef = useRef(null);
  const blockUser = useBlockUser();
  const { userInfo } = useUser();
  const { socket } = useContext(UserContext);

  const recipientId = currentChat?.members?.find(
    (member) => member._id !== userInfo?._id
  );
  const [incomingCallData, setIncomingCallData] = useState(null);
  const { data: recipientUser, isLoading: recipientUserLoading } =
    useRecipientUser(recipientId?._id);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [editMode, setEditMode] = useState(false);
  const [messageBeingEdited, setMessageBeingEdited] = useState(null);

  const handleAvatarClick = () => {
    setUserDetailDrawerOpen(true);
  };

  const handleVideoCall = () => {
    setVideoCallOpen(true);
  };

  const handleCloseVideoCall = () => {
    setVideoCallOpen(false);
  };

  const handleStartChat = () => {
    setUserDetailDrawerOpen(false);
  };

  const handleBlockUser = () => {
    if (!recipientUser?._id) return;

    const messageData = {
      blockerId: userInfo?._id,
      blockedId: recipientUser._id,
    };

    blockUser.mutate(messageData, {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        setUserDetailDrawerOpen(false);
        navigate("/chat");
      },
      onError: (error) => {
        console.error("Block user failed:", error);
      },
    });
  };

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const messageData = {
      chatId: currentChat._id,
      senderId: userInfo._id,
      text: message.trim(),
    };

    if (editMode) {
      socket.emit("editMessage", {
        ...messageData,
        messageId: messageBeingEdited._id,
      });
      setEditMode(false);
      setMessageBeingEdited(null);
    } else {
      socket.emit("sendMessage", messageData);
    }
  };

  const handleEditMessage = (message) => {
    setEditMode(true);
    setMessageBeingEdited(message);
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
  if (!currentChat || !currentChat._id) {
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

      <ChatMessages
        onEditMessage={handleEditMessage}
        currentChat={currentChat}
        recipientId={recipientId}
      />

      <InputEmojiComponent
        handleSendMessage={handleSendMessage}
        messageInputRef={messageInputRef}
        isEditing={editMode}
        messageBeingEdited={messageBeingEdited}
      />

      <VideoCall
        open={videoCallOpen}
        onClose={handleCloseVideoCall}
        recipientUser={recipientUser}
        incomingCallData={incomingCallData}
        setIncomingCallData={setIncomingCallData}
      />

      <UserDetail
        open={userDetailDrawerOpen}
        onClose={() => setUserDetailDrawerOpen(false)}
        recipientUser={recipientUser}
        onStartChat={handleStartChat}
        onBlockUser={handleBlockUser}
        isLoading={recipientUserLoading}
      />
    </Box>
  );
};

export default ChatConversation;
