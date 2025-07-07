import {
  Avatar,
  Box,
  Grid,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useContext } from "react";
import { useRecipientUser, useWithLastMessages } from "../../features/queries";
import UserContext from "../../context/UserInfo";
import { useChatData } from "../../context/contexts";

const UserChat = ({ chat, user }) => {
  const recipientId = chat?.members?.find((id) => id && id !== user?._id);
  const { data: recipientUser } = useRecipientUser(recipientId);
  const { onlineUsers } = useContext(UserContext);
  const { notifications } = useChatData();
  const { data: withLastMessages } = useWithLastMessages(user?._id);
  const currentChatData = withLastMessages?.find(
    (chatData) => chatData._id === chat._id
  );

  const lastMessage = currentChatData?.lastMessage?.text || "";
  const lastMessageDate = currentChatData?.lastMessage?.createdAt
    ? new Date(currentChatData.lastMessage.createdAt).toLocaleDateString()
    : "";

  const unreadCount = notifications?.filter(
    (n) => n?.senderId === recipientUser?._id && !n?.isRead
  ).length;

  if (!recipientUser) return null;
  
  return (
    <Grid
      container
      alignItems="center"
      px={2}
      py={1}
      sx={{
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box display="flex" width="100%" alignItems="center">
        <Avatar />
        <Box ml={2} display="flex" flexDirection="column" width="100%">
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">{recipientUser.name}</Typography>
            <Typography variant="caption">{lastMessageDate}</Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {lastMessage && (
              <Typography
                variant="body2"
                noWrap
                sx={{ maxWidth: "180px", color: "text.secondary" }}
              >
                {lastMessage}
              </Typography>
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              {onlineUsers?.some(
                (onlineUser) => onlineUser.userId === recipientUser._id
              ) && <CircleIcon sx={{ color: "green", fontSize: 12 }} />}

              {unreadCount > 0 && (
                <Chip label={unreadCount} size="small" color="primary" />
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default UserChat;