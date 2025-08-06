import { useState } from "react";
import { Box, useMediaQuery, useTheme, Drawer } from "@mui/material";
import { useChatData } from "../../context/contexts";
import ChatConversation from "./ChatConversation";
import ChatSidebar from "./ChatSiderBar";
import { Outlet, useMatch } from "react-router-dom";

const Chat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedChat, setSelectedChat] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);
  const { currentChat, setCurrentChat } = useChatData();

  const showUserDetail = !!useMatch("/chat/user/:userId");

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
      <Box sx={{ display: "flex", height: "100vh" }}>
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
            setCurrentChat={setCurrentChat}
          />
        </Box>

        {!showUserDetail ? (
          <ChatConversation
            chatId={currentChat?._id}
            currentChat={currentChat}
            onBackToChats={handleBackToChats}
            onMenuToggle={handleDrawerToggle}
          />
        ) : (
          <Outlet />
        )}
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
        !showUserDetail && (
          <ChatConversation
            currentChat={currentChat}
            onBackToChats={handleBackToChats}
            onMenuToggle={handleDrawerToggle}
          />
        )
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

      {showUserDetail && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "background.default",
            zIndex: 1300,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      )}
    </Box>
  );
};

export default Chat;
