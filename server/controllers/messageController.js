const messageModel = require("../models/messageModel");

//creatre message
const createMessage = async (req, res) => {
  const { chatId, senderId, text, isRead } = req.body;
  try {
    const newMessage = new messageModel({
      chatId,
      senderId,
      text,
      isRead,
    });

    const response = await newMessage.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error creating message", error });
  }
};

const getMessages = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};
const deleteMessage = async (req, res) => {
  const messageId = req.params.messageId;

  try {
    const deleted = await messageModel.findByIdAndDelete(messageId);
    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
};

module.exports = { createMessage, getMessages, deleteMessage };
