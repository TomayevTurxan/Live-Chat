import { useState } from "react";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
  Box,
  Chip,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { useIncomingChatRequests } from "../../features/queries";
// import { useAcceptChatRequest, useRejectChatRequest } from "../../features/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useAcceptChatRequest } from "../../features/mutations";

const IncomingRequests = ({ userInfo }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useIncomingChatRequests(userInfo?._id);
  const [loadingId, setLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  const acceptMutation = useAcceptChatRequest();
  //   const rejectMutation = useRejectChatRequest();

  const handleAcceptRequest = (requestId) => {
    setLoadingId(requestId);
    setActionType("accept");

    acceptMutation.mutate(requestId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["incomingChatRequests"]);
        queryClient.invalidateQueries(["userChats"]); 
        setLoadingId(null);
        setActionType(null);
      },
      onError: (error) => {
        console.error("Error accepting chat request:", error);
        setLoadingId(null);
        setActionType(null);
      },
    });
  };

  //   const handleRejectRequest = (requestId) => {
  //     setLoadingId(requestId);
  //     setActionType('reject');

  //     rejectMutation.mutate(requestId, {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries(["incomingChatRequests"]);
  //         setLoadingId(null);
  //         setActionType(null);
  //       },
  //       onError: (error) => {
  //         console.error("Error rejecting chat request:", error);
  //         setLoadingId(null);
  //         setActionType(null);
  //       },
  //     });
  //   };

  if (isLoading) return <CircularProgress sx={{ m: 2 }} />;

  if (!data || data.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, m: 2, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Incoming Chat Requests
        </Typography>
        <Typography variant="body2" color="text.secondary">
          When someone sends you a chat request, it will appear here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ m: 2 }}>
      <List sx={{ maxHeight: 400, overflow: "auto" }}>
        {data.map((req, index) => (
          <ListItem
            key={req._id}
            sx={{
              borderBottom:
                index < data.length - 1 ? "1px solid #f0f0f0" : "none",
              py: 2,
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  width: 48,
                  height: 48,
                }}
              >
                {req.sender?.name ? (
                  req.sender.name.charAt(0).toUpperCase()
                ) : (
                  <PersonIcon />
                )}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="medium">
                  {req.sender?.name || "Unknown User"}
                </Typography>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {req.sender?.email || "No email provided"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requested on{" "}
                    {new Date(req.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              }
            />

            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
              {loadingId === req._id ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="caption" color="text.secondary">
                    {actionType === "accept" ? "Accepting..." : "Rejecting..."}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckIcon />}
                    onClick={() => handleAcceptRequest(req._id)}
                    sx={{
                      minWidth: 90,
                      textTransform: "none",
                      fontWeight: "medium",
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CloseIcon />}
                    // onClick={() => handleRejectRequest(req._id)}
                    sx={{
                      minWidth: 90,
                      textTransform: "none",
                      fontWeight: "medium",
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default IncomingRequests;
