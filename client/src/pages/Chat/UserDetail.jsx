import {
  Drawer,
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import {
  Close,
  Email,
  Person,
  Schedule,
  Message,
  Block,
} from "@mui/icons-material";

const UserDetail = ({
  open,
  onClose,
  recipientUser,
  onStartChat,
  onBlockUser,
  isLoading,
}) => {

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    
    if (!recipientUser) {
      return (
        <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" color="error">
            User not found
          </Typography>
        </Box>
      </Drawer>
    );
  }
  if (isLoading) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 350, p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 400, md: 450 },
            maxWidth: "100vw",
          },
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Contact Info
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              backgroundColor: "background.default",
            }}
          >
            <Avatar
              src={recipientUser?.avatar}
              sx={{
                width: 120,
                height: 120,
                fontSize: 36,
                mb: 1,
              }}
            >
              {recipientUser?.name?.charAt(0)}
            </Avatar>

            <Typography variant="h5" fontWeight={600} textAlign="center">
              {recipientUser?.name}
            </Typography>
          </Box>

          <Divider />


          <Box sx={{ p: 2, display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Message />}
              onClick={() => {
                onStartChat?.();
                onClose();
              }}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Message
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Block />}
              onClick={() => {
                onBlockUser?.();
                onClose();
              }}
              sx={{ borderRadius: 2, minWidth: 100 }}
            >
              Block
            </Button>
          </Box>

          <Divider />


          <Box sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              About
            </Typography>


            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Person sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Username
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 3 }}>
                {recipientUser?.name}
              </Typography>
            </Box>


            {recipientUser?.email && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Email
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Email
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 3 }}>
                  {recipientUser?.email}
                </Typography>
              </Box>
            )}


            {recipientUser?.createdAt && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Schedule
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Member Since
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 3 }}>
                  {formatDate(recipientUser.createdAt)}
                </Typography>
              </Box>
            )}

            {recipientUser?.bio && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{ mb: 1 }}
                >
                  Bio
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor: "background.default",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {recipientUser?.bio}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UserDetail;
