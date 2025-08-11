import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import UserContext from "../../context/UserInfo";

const MessageBubble = ({
  message,
  isMyMessage,
  formatTime,
  onEditMessage,
}) => {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { socket } = useContext(UserContext);

  const menuOpen = Boolean(menuAnchor);
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDelete = async () => {
    try {
      handleMenuClose();
      socket.emit("deleteMessage", {
        messageId: message._id,
        chatId: message.chatId,
      });
      queryClient.invalidateQueries(["messages"]);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const menuItems = [
    {
      icon: <InfoOutlinedIcon />,
      text: "Message info",
    },
    {
      icon: <EditIcon />,
      text: "Edit",
      action: () => onEditMessage(message),
    },
    {
      icon: <ContentCopyIcon />,
      text: "Copy",
      action: () => navigator.clipboard.writeText(message.text),
    },
    {
      icon: <EmojiEmotionsOutlinedIcon />,
      text: "React",
    },
    {
      icon: <DeleteOutlineIcon fontSize="small" />,
      text: "Delete",
      action: handleDelete,
      isDelete: true,
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMyMessage ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 1,
        mb: 1,
        position: "relative",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          minWidth: "100px",
          p: 1,
          backgroundColor: isMyMessage ? "primary.main" : "grey.100",
          color: isMyMessage ? "grey.100" : "primary.main",
          boxShadow: isHovered ? 3 : 1,
          position: "relative",
          transition: "all 0.2s ease-in-out",
          borderRadius: "5px",
          cursor: "pointer",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            width: 0,
            height: 0,
            ...(isMyMessage
              ? {
                  right: -6,
                  borderLeft: "8px solid ",
                  color: "primary.main",
                  borderTop: "4px solid transparent",
                  borderBottom: "7px solid transparent",
                }
              : {
                  left: -6,
                  borderRight: "8px solid ",
                  color: "grey.100",
                  borderTop: "4px solid transparent",
                  borderBottom: "7px solid transparent",
                }),
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            transition: "opacity 0.2s ease-in-out",
            pr: 7,
          }}
        >
          {message?.text}
        </Typography>
        {isMyMessage && (
          <Fade in={isHovered} timeout={200}>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                color: "grey.100",
                zIndex: 2,
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Fade>
        )}
        <Box display="flex" justifyContent="end">
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              fontSize: "0.7rem",
              display: "block",
              textAlign: isMyMessage ? "right" : "left",
              transition: "opacity 0.2s ease-in-out",
              color: isMyMessage ? "grey.100" : "primary.main",
            }}
          >
            {formatTime(message?.createdAt)}
          </Typography>
          {isMyMessage && (
            <>
              {message?.isRead ? (
                <DoneAllIcon sx={{ fontSize: 18, color: "#4fc3f7" }} />
              ) : (
                <DoneIcon sx={{ fontSize: 18, color: "grey" }} />
              )}
            </>
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              maxWidth: 200,
              bgcolor: "#2a2f32",
              color: "#e9edef",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              "& .MuiMenuItem-root": {
                minHeight: 40,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
                "&.delete-item": {
                  color: "#ff6b6b",
                  "&:hover": {
                    bgcolor: "rgba(255, 107, 107, 0.1)",
                  },
                },
              },
            },
          },
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              if (!item?.isDelete) {
                handleMenuClose();
              }
            }}
            className={item?.isDelete ? "delete-item" : ""}
            sx={{
              "&.Mui-disabled": {
                opacity: 0.6,
                color: item?.isDelete ? "#ff6b6b" : "inherit",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                mr: 0,
                "& svg": {
                  fontSize: 18,
                },
              }}
            >
              {item?.icon}
            </ListItemIcon>
            <ListItemText
              primary={item?.text}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: 14,
                  },
                },
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MessageBubble;
