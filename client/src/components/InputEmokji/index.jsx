import { Send } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import InputEmoji from "react-input-emoji";

const InputEmojiComponent = ({
  handleSendMessage,
  handleKeyPress,
  messageInputRef,
  isEditing,
  messageBeingEdited,
}) => {
  const [message, setInternalMessage] = useState("");

  const setMessage = (value) => {
    setInternalMessage(value);
  };
  const handleSend = async () => {
    if (!message.trim()) return;
    await handleSendMessage(message);
    setMessage("");
  };

  return (
    <Box
      sx={{
        p: { xs: 1, md: 2 },
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <InputEmoji
          value={isEditing ? messageBeingEdited?.text : message}
          onChange={setMessage}
          onEnter={handleSend}
          onKeyPress={handleKeyPress}
          fontFamily="nunito"
          borderColor="rgba(72, 112, 223, 0.2)"
          cleanOnEnter
          placeholder="Type your message..."
          ref={messageInputRef}
        />
      </Box>

      <Button
        variant="contained"
        type="button"
        onClick={handleSend}
        disabled={!message.trim()}
        startIcon={<Send />}
        sx={{
          height: { xs: "40px", md: "48px" },
          fontSize: { xs: "0.875rem", md: "1rem" },
          borderRadius: 3,
          px: { xs: 2, md: 3 },
        }}
      >
        Send
      </Button>
    </Box>
  );
};

export default InputEmojiComponent;
