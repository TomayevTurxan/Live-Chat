import InputEmoji from "react-input-emoji";

const InputEmojiComponent = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyPress,
  messageInputRef,
}) => {
  return (
    <InputEmoji
      value={message}
      onChange={setMessage}
      onEnter={handleSendMessage}
      onKeyPress={handleKeyPress}
      fontFamily="nunito"
      borderColor="rgba(72, 112, 223, 0.2)"
      cleanOnEnter
      placeholder="Type your message..."
      ref={messageInputRef}
    />
  );
};

export default InputEmojiComponent;
