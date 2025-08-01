import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Slide,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { keys } from "../../features/queries";

const MessageBubble = ({
  message,
  isMyMessage,
  formatTime,
  onDeleteMessage,
  userInfo,
}) => {
  const queryClient = useQueryClient();

  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDelete = async () => {
    handleMenuClose();
    setIsDeleting(true);
    try {
      await onDeleteMessage(message._id, message.chatId);
      queryClient.invalidateQueries({
        queryKey: keys.getWithLastMessage(userInfo._id),
      });
      queryClient.invalidateQueries(["messages"]);
    } catch (error) {
      setIsDeleting(false);
      console.error("Failed to delete message:", error);
    }
  };

  const menuItems = [
    {
      icon: <InfoOutlinedIcon />,
      text: "Message info",
      action: () => console.log("Message info"),
    },
    {
      icon: <ReplyIcon />,
      text: "Reply",
      action: () => console.log("Reply"),
    },
    {
      icon: <ContentCopyIcon />,
      text: "Copy",
      action: () => navigator.clipboard.writeText(message.text),
    },
    {
      icon: <EmojiEmotionsOutlinedIcon />,
      text: "React",
      action: () => console.log("React"),
    },
    {
      icon: isDeleting ? (
        <Box
          sx={{
            width: 16,
            height: 16,
            border: "2px solid currentColor",
            borderTop: "2px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
      ) : (
        <DeleteOutlineIcon fontSize="small" />
      ),
      text: isDeleting ? "Deleting..." : "Delete",
      action: handleDelete,
      isDelete: true,
    },
  ];

  return (
    <Slide
      direction={isMyMessage ? "left" : "right"}
      in={!isDeleting}
      timeout={300}
      unmountOnExit
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isMyMessage ? "flex-end" : "flex-start",
          alignItems: "flex-end",
          gap: 1,
          mb: 1,
          position: "relative",
          transition: "all 0.2s ease-in-out",
          transform: isDeleting ? "scale(0.95)" : "scale(1)",
          opacity: isDeleting ? 0.7 : 1,
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
              opacity: isDeleting ? 0.5 : 1,
              pr: 7,
            }}
          >
            {message.text}
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
              {formatTime(message.createdAt)}
            </Typography>
            {isMyMessage && (
              <>
                {message.isRead ? (
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
          anchorOrigin={{
            vertical: "bottom",
            horizontal: isMyMessage ? "left" : "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: isMyMessage ? "right" : "left",
          }}
          PaperProps={{
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
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                item.action();
                if (!item.isDelete) {
                  handleMenuClose();
                }
              }}
              disabled={isDeleting && item.isDelete}
              className={item.isDelete ? "delete-item" : ""}
              sx={{
                "&.Mui-disabled": {
                  opacity: 0.6,
                  color: item.isDelete ? "#ff6b6b" : "inherit",
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
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Slide>
  );
};

export default MessageBubble;
