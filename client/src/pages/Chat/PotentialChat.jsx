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
  Button,
  Chip,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../context/contexts";
import { useQueryClient } from "@tanstack/react-query";
import UserContext from "../../context/UserInfo";
import { usePotentialChatsUser } from "../../features/queries";
import { useCreateChat } from "../../features/mutations";

const PotentialChats = () => {
  const queryClient = useQueryClient();
  const { onlineUsers } = useContext(UserContext);
  const { userInfo } = useUser();
  const { data: potentialChatsUser, isLoading } = usePotentialChatsUser(
    userInfo?._id
  );

  const createChatRequestMutation = useCreateChat();

  const handleSendChatRequest = (otherUserId) => {
    if (!userInfo?._id || !otherUserId) return;

    createChatRequestMutation.mutate(
      {
        senderId: userInfo._id,
        receiverId: otherUserId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["potentialChatsUser"]);
          queryClient.invalidateQueries(["chatRequests"]);
        },
        onError: (error) => {
          console.error("Error sending chat request:", error);
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
            sx={{
              borderBottom:
                index < potentialChatsUser.length - 1
                  ? "1px solid #eee"
                  : "none",
              py: 2,
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  border: onlineUsers?.some((user) => user._id === userItem._id)
                    ? "2px solid green"
                    : "2px solid transparent",
                  transition: "border 0.3s ease",
                  width: 48,
                  height: 48,
                }}
              >
                {userItem?.name ? (
                  userItem?.name.charAt(0).toUpperCase()
                ) : (
                  <PersonAddIcon />
                )}
              </Avatar>
              {onlineUsers?.some((user) => user._id === userItem._id) && (
                <Chip
                  label="Online"
                  size="small"
                  color="success"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    fontSize: "0.6rem",
                    height: 16,
                  }}
                />
              )}
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
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
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
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

            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              {userItem?.requestStatus === "pending" ? (
                <Chip label="Pending" color="warning" size="small" />
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={() => handleSendChatRequest(userItem._id)}
                >
                  Send Request
                </Button>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PotentialChats;
