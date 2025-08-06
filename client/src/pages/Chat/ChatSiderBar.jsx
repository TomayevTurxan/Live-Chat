import { useContext, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  List,
  Modal,
  Tooltip,
  Paper,
  Button,
  Badge,
  Chip,
} from "@mui/material";
import { PersonAdd, Close, Logout, MailOutline } from "@mui/icons-material";
import UserChat from "./UserChat";
import PotentialChats from "./PotentialChat";
import { useUser } from "../../context/contexts";
import UserContext from "../../context/UserInfo";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import IncomingRequests from "./IncomingRequests";
import { useUserChats } from "../../features/queries";

const ChatSidebar = ({ onChatSelect, selectedChat, setCurrentChat }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userInfo, logout } = useUser();
  const { socket } = useContext(UserContext);
  const [showPotentialChats, setShowPotentialChats] = useState(false);
  const [showIncomingRequests, setShowIncomingRequests] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: userChats,
    isLoading: loadingChats,
    isError,
  } = useUserChats(userInfo?._id);
  console.log('userChats',userChats)
  const handlePotentialChatsToggle = () => {
    setShowPotentialChats(!showPotentialChats);
  };
  const handleIncomingRequestsToggle = () => {
    setShowIncomingRequests((prev) => !prev);
  };

  const handleChatSelect = (chat) => {
    onChatSelect(chat);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    queryClient.clear();
    setCurrentChat(null);
    logout();
    navigate("/login");
  };

  const filteredChats = userChats?.filter((chat) => {
    const otherUser = chat.members.find(
      (member) => member._id !== userInfo._id
    );
    return (
      otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      otherUser?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  if (loadingChats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <Typography variant="body2" color="text.secondary">
          Loading chats...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <Typography variant="body2" color="error">
          Failed to load chats.
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Typography variant="h6" sx={{ flexShrink: 0 }}>
            Live Chat
          </Typography>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography
              variant="body2"
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: { sm: "0.75rem", md: "0.875rem" },
              }}
            >
              Welcome, {userInfo?.name}!
            </Typography>
            <Tooltip title="Find new people to chat">
              <IconButton
                onClick={handlePotentialChatsToggle}
                color="primary"
                size="small"
              >
                <PersonAdd />
              </IconButton>
            </Tooltip>
            <Tooltip title="Incoming Chat Requests">
              <IconButton
                onClick={handleIncomingRequestsToggle}
                color="primary"
                size="small"
              >
                <Badge color="error" max={99}>
                  <MailOutline />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TextField
          fullWidth
          placeholder="Search chats..."
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mt: 2 }}
        />
      </Box>

      <List sx={{ flex: 1, overflow: "auto", px: 1 }}>
        {filteredChats?.length > 0 ? (
          filteredChats?.map((chat, index) => (
            <Box
              key={chat._id || index}
              onClick={() => handleChatSelect(chat)}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                p: 1,
                mb: 1,
                backgroundColor:
                  selectedChat?._id === chat._id
                    ? "action.selected"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    selectedChat?._id === chat._id
                      ? "action.selected"
                      : "action.hover",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <UserChat chat={chat} user={userInfo} />
            </Box>
          ))
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
            flexDirection="column"
            sx={{ color: "text.secondary" }}
          >
            <Typography variant="body2" align="center">
              No chats found
            </Typography>
            <Typography variant="caption" align="center" sx={{ mt: 1 }}>
              Start a new conversation
            </Typography>
          </Box>
        )}
      </List>

      <Box
        p={2}
        borderTop="1px solid"
        borderColor="divider"
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Logout />}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "error.main",
              color: "white",
              borderColor: "error.main",
            },
          }}
        >
          Log out
        </Button>
      </Box>

      <Modal
        open={showPotentialChats}
        onClose={handlePotentialChatsToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            width: "450px",
            overflow: "auto",
            outline: "none",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ p: 1 }}>
              <Typography variant="h5" color="primary">
                Send Chat Requests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send requests to start conversations
              </Typography>
            </Box>
            <IconButton onClick={handlePotentialChatsToggle}>
              <Close />
            </IconButton>
          </Box>
          <PotentialChats />
        </Paper>
      </Modal>
      <Modal
        open={showIncomingRequests}
        onClose={handleIncomingRequestsToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            width: "650px",
            overflow: "auto",
            outline: "none",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Incoming Chat Requests
              </Typography>
            </Box>
            <IconButton onClick={handleIncomingRequestsToggle}>
              <Close />
            </IconButton>
          </Box>
          <IncomingRequests userInfo={userInfo} />
        </Paper>
      </Modal>
    </Box>
  );
};

export default ChatSidebar;
