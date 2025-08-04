const messageModel = require("../models/messageModel");

//creatre message
const createMessage = async (req, res) => {
  const { chatId, senderId, text, isRead, messageId } = req.body;

  try {
    if (messageId) {
      const updated = await messageModel.findByIdAndUpdate(messageId, { text });

      if (!updated) {
        return res.status(404).json({ message: "Message not found" });
      }

      return res
        .status(200)
        .json({ message: "Message updated successfully", data: updated });
    }

    const newMessage = new messageModel({
      chatId,
      senderId,
      text,
      isRead,
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create or edit message", error });
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

const editMessage = async (req, res) => {
  const messageId = req.params.messageId;
  const { text } = req.body;

  try {
    const updated = await messageModel.findByIdAndUpdate(messageId, { text });

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Error editing message", error });
  }
};
module.exports = { createMessage, getMessages, deleteMessage, editMessage };
