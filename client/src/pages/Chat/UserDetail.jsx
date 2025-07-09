import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Close, Email, Person, Schedule, Message } from "@mui/icons-material";
import ChipOnline from "../../components/Chip";
import { useRecipientUser } from "../../features/queries";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: recipientUser, isLoading } = useRecipientUser(userId);

  const handleBack = () => navigate("/chat");
  const handleStartChat = () => navigate("/chat");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!recipientUser) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">
          User not found
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Chat
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">
          <IconButton onClick={handleBack}>
            <KeyboardBackspaceIcon />
          </IconButton>
          User Profile
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={recipientUser.avatar}
              sx={{ width: 150, height: 150, fontSize: 48 }}
            >
              {recipientUser.name?.charAt(0)}
            </Avatar>

            <Typography variant="h6">{recipientUser.name}</Typography>

            <ChipOnline recipientUser={recipientUser} />

            <Button
              variant="contained"
              startIcon={<Message />}
              onClick={handleStartChat}
              fullWidth
            >
              Start Chat
            </Button>
          </Box>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Username
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Person sx={{ mr: 1 }} />
                  {recipientUser.name}
                </Typography>
              </Box>
            </Grid>

            {recipientUser.email && (
              <Grid item size={12}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Email sx={{ mr: 1 }} />
                    {recipientUser.email}
                  </Typography>
                </Box>
              </Grid>
            )}

            {recipientUser.createdAt && (
              <Grid size={12}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Schedule sx={{ mr: 1 }} />
                    {formatDate(recipientUser.createdAt)}
                  </Typography>
                </Box>
              </Grid>
            )}

            {recipientUser.bio && (
              <Grid item size={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Bio
                </Typography>
                <Typography variant="body1">{recipientUser.bio}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetail;
