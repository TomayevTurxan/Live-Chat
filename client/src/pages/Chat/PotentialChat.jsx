import { useState, useContext } from "react";
import {
  Avatar,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PotentialChatContext from "../../context/PotentialChatContext";
import { useCreateChat } from "../../features/mutations";
import { useUser } from "../../context/contexts";
import { useQueryClient } from "@tanstack/react-query";

const PotentialChats = () => {
  const queryClient = useQueryClient();
  const { potentialChats, setPotentialChats } =
    useContext(PotentialChatContext);
  const { userInfo } = useUser();
  const createChatMutation = useCreateChat();

  const [loadingId, setLoadingId] = useState(null);

  const handleCreateChat = (otherUserId) => {
    if (!userInfo?._id || !otherUserId) return;

    setLoadingId(otherUserId);
    createChatMutation.mutate(
      {
        firstId: userInfo._id,
        secondId: otherUserId,
      },
      {
        onSuccess: (newChat) => {
          queryClient.invalidateQueries(["potentialChats"]);
          setPotentialChats((prev) =>
            prev.filter((u) => !newChat.members.includes(u._id))
          );
          setLoadingId(null);
        },
        onError: () => {
          setLoadingId(null);
        },
      }
    );
  };

  if (!potentialChats || potentialChats.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, m: 2 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          No potential chats available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ m: 2 }}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {potentialChats.map((userItem, index) => (
          <ListItem
            key={userItem._id || index}
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              borderBottom:
                index < potentialChats.length - 1 ? "1px solid #eee" : "none",
            }}
          >
            <ListItemAvatar>
              <Avatar>
                {userItem.name ? (
                  userItem.name.charAt(0).toUpperCase()
                ) : (
                  <ChatIcon />
                )}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    {userItem.name || "Unknown User"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(userItem.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {userItem.email || "No email provided"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Joined{" "}
                    {new Date(userItem.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              }
            />

            <Box
              sx={{ display: "flex", alignItems: "center" }}
              onClick={() => handleCreateChat(userItem._id)}
            >
              {loadingId === userItem._id ? (
                <CircularProgress size={24} />
              ) : (
                <ChatIcon
                  sx={{
                    color: "primary.main",
                    fontSize: 20,
                    opacity: 0.7,
                    cursor: "pointer",
                  }}
                />
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PotentialChats;
