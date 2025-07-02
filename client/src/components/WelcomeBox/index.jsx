import { Box, Typography } from "@mui/material";

const WelcomeBox = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        color: "text.secondary",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Welcome to Live Chat
      </Typography>
      <Typography variant="body2" align="center">
        Select a conversation to start messaging
      </Typography>
    </Box>
  );
};

export default WelcomeBox;
