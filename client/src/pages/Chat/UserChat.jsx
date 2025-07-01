import { Avatar, Box, Grid, Typography, Stack, Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useContext, useEffect } from "react";
import PotentialChatContext from "../../context/PotentialChatContext";
import { useAllUsers, useRecipientUser } from "../../features/queries";

const UserChat = ({ chat, user, userChats }) => {
  const recipientId = chat?.members.find((id) => id !== user._id);
  const { setPotentialChats, setPotentialLoading } =
    useContext(PotentialChatContext);
  const { data: recipientUser } = useRecipientUser(recipientId);
  const { data: allUsers } = useAllUsers();
  const lastMessage = "Text Message";
  const lastMessageDate = "12/12/2022";
  const unreadCount = 2;

  useEffect(() => {
    if (!userChats || !allUsers) return;

    setPotentialLoading(true);

    const filtered = allUsers.filter((u) => {
      if (u._id === user._id) return false;

      const isAlreadyInChat = userChats.some((chat) =>
        chat?.members?.includes(u._id)
      );

      return !isAlreadyInChat;
    });

    setPotentialChats(filtered);

    setPotentialLoading(false);
  }, [userChats, allUsers, user]);

  if (!recipientUser) return null;
  return (
    <Grid
      container
      alignItems="center"
      px={2}
      py={1}
      sx={{
        cursor: "pointer",
        borderBottom: "1px solid #eee",
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
            <Typography
              variant="body2"
              noWrap
              sx={{ maxWidth: "180px", color: "text.secondary" }}
            >
              {lastMessage}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <CircleIcon sx={{ color: "green", fontSize: 12 }} />
              <Chip
                label={unreadCount}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default UserChat;
