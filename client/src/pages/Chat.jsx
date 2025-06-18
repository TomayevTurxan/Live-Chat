import {
  Box,
  Grid,
  Avatar,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Stack,
  Button,
  useColorScheme,
} from "@mui/material";
import { LightMode, DarkMode as DarkModeIcon } from "@mui/icons-material";
import React from "react";
import { useUser } from "../context/contexts";

const Chat = () => {
  const { mode, setMode } = useColorScheme();

  const { userInfo } = useUser();
  console.log("userr", userInfo);
  const handleToggle = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <Grid container height="100vh">
      <Grid size={3} borderRight="1px solid #eee">
        <Box p={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Live Chat</Typography>
            Welcome, {userInfo?.name}!
          </Box>
          <Grid size={12}>
            <TextField
              fullWidth
              placeholder="Search"
              size="small"
              sx={{ mt: 2 }}
            />
          </Grid>
        </Box>

        <List>
          {["Ilkin"].map((name, i) => (
            <React.Fragment key={i}>
              <ListItem button alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={name}
                  secondary={i === 0 ? "typing..." : "Have a nice day!"}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Grid>

      <Grid size={9} display="flex" flexDirection="column">
        <Box
          p={2}
          borderBottom="1px solid #eee"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle1">Turkhan</Typography>
              <Typography variant="caption"> Online</Typography>
            </Box>
          </Box>
          <IconButton onClick={handleToggle} color="inherit">
            {mode === "dark" ? <DarkModeIcon /> : <LightMode />}
          </IconButton>
        </Box>

        <Box p={3} flexGrow={1} overflow="auto">
          <Stack spacing={2}>
            <Box alignSelf="flex-end" maxWidth="70%">
              <Paper sx={{ p: 2, bgcolor: "#1976d2", color: "white" }}>
                Hello! I’m Turkhan. How can I help you?
              </Paper>
            </Box>

            <Box alignSelf="flex-start" maxWidth="70%">
              <Paper sx={{ p: 2 }}>Test</Paper>
            </Box>

            <Box alignSelf="flex-end" maxWidth="70%">
              <Paper sx={{ p: 2, bgcolor: "#1976d2", color: "white" }}>
                Test
              </Paper>
            </Box>
          </Stack>
        </Box>

        <Box p={2} borderTop="1px solid #eee">
          <Grid container spacing={1}>
            <Grid size={11}>
              <TextField placeholder="Type your message…" fullWidth />
            </Grid>
            <Grid size={1}>
              <Button variant="contained">Send</Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
