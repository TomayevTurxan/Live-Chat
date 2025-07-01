import { useState } from "react";
import {
  Box,
  Grid,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";
import ChatSidebar from "./ChatSiderBar";
import ChatConversation from "./ChatConversation";

const Chat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [currentChat, setCurrentChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);

  // Handlers
  const handleChatSelect = (chat) => {
    console.log("Selected chat:", chat);
    setCurrentChat(chat);
    setSelectedChat(chat);
    
    // On mobile, show chat view and close drawer
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

  // Desktop/Tablet Layout
  if (!isMobile) {
    return (
      <Box sx={{ height: '100vh', display: 'flex' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: { md: '320px', lg: '360px' },
            borderRight: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <ChatSidebar 
            onChatSelect={handleChatSelect}
            selectedChat={selectedChat}
          />
        </Box>

        {/* Main Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ChatConversation 
            currentChat={currentChat}
            onBackToChats={handleBackToChats}
            onMenuToggle={handleDrawerToggle}
          />
        </Box>
      </Box>
    );
  }

  // Mobile Layout
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!showChatView ? (
        /* Mobile: Show Chat List */
        <ChatSidebar 
          onChatSelect={handleChatSelect}
          selectedChat={selectedChat}
        />
      ) : (
        /* Mobile: Show Chat Conversation */
        <ChatConversation 
          currentChat={currentChat}
          onBackToChats={handleBackToChats}
          onMenuToggle={handleDrawerToggle}
        />
      )}

      {/* Mobile Drawer for additional navigation */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '280px',
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