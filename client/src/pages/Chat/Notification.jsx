import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button,
  Drawer,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useChatData } from "../../context/contexts";

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { allUsers, notifications, setNotifications } = useChatData();
  const open = Boolean(anchorEl);
  const unread = notifications?.filter((n) => !n.isRead) || [];
  const read = notifications?.filter((n) => n.isRead) || [];
  const all = [...unread, ...read].map((n) => {
    const sender = allUsers?.find((u) => u._id === n.senderId);
    return {
      ...n,
      senderName: sender?.name || "Unknown User",
    };
  });

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const groupedNotifications = all.reduce((acc, notif) => {
    const key = notif.senderId;

    if (!acc[key]) {
      acc[key] = {
        ...notif,
        count: 1,
      };
    } else {
      acc[key].count += 1;

      if (new Date(notif.date) > new Date(acc[key].date)) {
        acc[key].date = notif.date;
        acc[key].chatId = notif.chatId;
      }
    }

    return acc;
  }, {});

  const groupedList = Object.values(groupedNotifications).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unread.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { sx: { width: 360 } } }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, pt: 1 }}
        >
          <Typography variant="h6">All Notifications</Typography>
          <Button size="small" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </Box>
        <Divider />

        {all.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          [
            ...groupedList.slice(0, 5).map((notification, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  handleClose();
                }}
                sx={{
                  alignItems: "flex-start",
                  bgcolor: !notification.isRead
                    ? "rgba(25, 118, 210, 0.1)"
                    : "inherit",
                  fontWeight: !notification.isRead ? "bold" : "normal",
                  borderBottom: "1px solid #f0f0f0",
                  py: 1.2,
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      {notification.senderName}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.count > 1
                          ? `${notification.count} new messages`
                          : `New message`}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {new Date(notification.date).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </MenuItem>
            )),
            <Box sx={{ px: 2, py: 1 }} key="view-all-btn">
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setDrawerOpen(true);
                  handleClose();
                }}
              >
                View All Notifications
              </Button>
            </Box>,
          ]
        )}
      </Menu>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ sx: { width: 360 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            All Notifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ maxHeight: "80vh", overflowY: "auto" }}>
            {groupedList.map((notification, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: !notification.isRead
                    ? "rgba(25, 118, 210, 0.1)"
                    : "inherit",
                  borderBottom: "1px solid #eee",
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2">
                  {notification.senderName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.count > 1
                    ? `${notification.count} new messages`
                    : `New message`}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {new Date(notification.date).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Notification;
