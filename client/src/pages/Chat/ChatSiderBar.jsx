import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  List,
  Modal,
  Tooltip,
  Paper,
} from "@mui/material";
import { PersonAdd, Close } from "@mui/icons-material";
import UserChat from "./UserChat";
import PotentialChats from "./PotentialChat";
import { useChatData, useUser } from "../../context/contexts";

const ChatSidebar = ({ onChatSelect, selectedChat }) => {
  const { userInfo } = useUser();
  const { userChats } = useChatData();

  const [showPotentialChats, setShowPotentialChats] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePotentialChatsToggle = () => {
    setShowPotentialChats(!showPotentialChats);
  };

  const handleChatSelect = (chat) => {
    onChatSelect(chat);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredChats =
    userChats?.filter(() => {
      return true;
    }) || [];
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
              <UserChat chat={chat} user={userInfo} userChats={userChats} />
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
        sx={{ backgroundColor: "background.paper" }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "success.main",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Online
          </Typography>
        </Box>
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
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
            >
              Find People to Chat
            </Typography>
            <IconButton onClick={handlePotentialChatsToggle}>
              <Close />
            </IconButton>
          </Box>
          <PotentialChats />
        </Paper>
      </Modal>
    </Box>
  );
};

export default ChatSidebar;
