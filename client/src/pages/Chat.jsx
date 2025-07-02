import { useState } from "react";
import { Box,  useMediaQuery, useTheme, Drawer } from "@mui/material";
import ChatSidebar from "./ChatSiderBar";
import ChatConversation from "./ChatConversation";

const Chat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentChat, setCurrentChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    setSelectedChat(chat);

    if (isMobile) {
      setShowChatView(true);
      setMobileDrawerOpen(false);
    }
  };

  const handleBackToChats = () => {
    if (isMobile) {
      setShowChatView(false);
      setCurrentChat([]);
      setSelectedChat(null);
    }
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  if (!isMobile) {
    return (
      <Box sx={{ height: "100vh", display: "flex" }}>
        <Box
          sx={{
            width: { md: "320px", lg: "360px" },
            borderRight: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <ChatSidebar
            onChatSelect={handleChatSelect}
            selectedChat={selectedChat}
          />
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ChatConversation
            chatId={currentChat?._id}
            currentChat={currentChat}
            onBackToChats={handleBackToChats}
            onMenuToggle={handleDrawerToggle}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {!showChatView ? (
        <ChatSidebar
          onChatSelect={handleChatSelect}
          selectedChat={selectedChat}
        />
      ) : (
        <ChatConversation
          currentChat={currentChat}
          onBackToChats={handleBackToChats}
          onMenuToggle={handleDrawerToggle}
        />
      )}

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "280px",
          },
        }}
      >
        <ChatSidebar
          onChatSelect={handleChatSelect}
          selectedChat={selectedChat}
        />
      </Drawer>
    </Box>
  );
};

export default Chat;
