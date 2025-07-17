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
  LinearProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useCreateChat } from "../../features/mutations";
import { useUser } from "../../context/contexts";
import { useQueryClient } from "@tanstack/react-query";
import UserContext from "../../context/UserInfo";
import { usePotentialChatsUser } from "../../features/queries";

const PotentialChats = () => {
  const queryClient = useQueryClient();
  const { onlineUsers } = useContext(UserContext);
  const { userInfo } = useUser();
  const { data: potentialChatsUser, isLoading } = usePotentialChatsUser(
    userInfo?._id
  );
  const [loadingId, setLoadingId] = useState(null);
  const createChatMutation = useCreateChat();

  const handleCreateChat = (otherUserId) => {
    if (!userInfo?._id || !otherUserId) return;

    setLoadingId(otherUserId);
    createChatMutation.mutate(
      {
        firstId: userInfo._id,
        secondId: otherUserId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["userChats"]);
          setLoadingId(null);
        },
        onError: () => {
          setLoadingId(null);
        },
      }
    );
  };
  if (isLoading) return <LinearProgress />;

  if (!potentialChatsUser || potentialChatsUser.length === 0) {
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
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          maxHeight: 400,
          overflow: "auto",
        }}
      >
        {potentialChatsUser.map((userItem, index) => (
          <ListItem
            key={userItem._id || index}
            onClick={() => handleCreateChat(userItem._id)}
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              borderBottom:
                index < potentialChatsUser.length - 1
                  ? "1px solid #eee"
                  : "none",
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  border: onlineUsers?.some((user) => user._id === userItem._id)
                    ? "2px solid green"
                    : "2px solid transparent",
                  transition: "border 0.3s ease",
                }}
              >
                {userItem?.name ? (
                  userItem?.name.charAt(0).toUpperCase()
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
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    component="span"
                  >
                    {userItem?.name || "Unknown User"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="span"
                  >
                    {new Date(userItem?.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              }
              secondary={
                <Box component="span" sx={{ mt: 0.5, display: "block" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                    sx={{ display: "block" }}
                  >
                    {userItem?.email || "No email provided"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="span"
                    sx={{ display: "block" }}
                  >
                    Joined{" "}
                    {new Date(userItem?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              }
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {loadingId === userItem?._id ? (
                <CircularProgress size={24} />
              ) : (
                <ChatIcon
                  sx={{
                    color: "primary.main",
                    fontSize: 20,
                    opacity: 0.7,
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
