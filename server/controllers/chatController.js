const mongoose = require("mongoose");
const chatModel = require("../models/chatModel");
const chatRequestModel = require("../models/chatRequestModel");
const userModel = require("../models/userModel");
const messageModel = require("../models/messageModel");

const createChatRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const existingChat = await chatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.status(400).json({ message: "Chat already exists." });
    }

    const existingRequest = await chatRequestModel.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Chat request already exists." });
    }

    const newRequest = new chatRequestModel({
      sender: senderId,
      receiver: receiverId,
    });

    await newRequest.save();
    await newRequest.populate("sender", "name email");

    res.status(200).json({
      message: "Chat request sent successfully.",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating chat request:", error);
    res.status(500).json({
      message: "Error creating chat request",
      error: error.message,
    });
  }
};

const acceptChatRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await chatRequestModel.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Chat request not found" });
    }

    const senderId = request.sender.toString();
    const receiverId = request.receiver.toString();

    const existingChat = await chatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!existingChat) {
      await chatModel.create({
        members: [senderId, receiverId],
      });
    }

    await chatRequestModel.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Chat request accepted and chat created" });
  } catch (error) {
    console.error("Error accepting chat request:", error);
    res.status(500).json({ message: "Failed to accept chat request", error });
  }
};

const rejectChatRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await chatRequestModel.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Chat request not found" });
    }

    await chatRequestModel.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Chat request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting chat request:", error);
    res.status(500).json({ message: "Failed to reject chat request", error });
  }
};

const inComingChatRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const incomingRequests = await chatRequestModel
      .find({ receiver: userId, status: "pending" })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(incomingRequests);
  } catch (error) {
    console.error("Error fetching incoming chat requests:", error);
    res.status(500).json({
      message: "Error fetching incoming chat requests",
      error: error.message,
    });
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const currentUser = await userModel.findById(userId).select("blockedUsers");
    const blockedIds = currentUser.blockedUsers.map((id) => id.toString());

    const chats = await chatModel.find({ members: userId }).populate({
      path: "members",
      select: "name email _id",
    });

    const filteredChats = chats.filter((chat) => {
      const otherUser = chat.members.find((m) => m._id.toString() !== userId);
      return otherUser && !blockedIds.includes(otherUser._id.toString());
    });

    res.status(200).json(filteredChats);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error finding chat", error });
  }
};

const findUserChatsWithLastMessage = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({ members: userId }).populate({
      path: "members",
      select: "name email _id",
    });

    const result = [];

    for (const chat of chats) {
      const lastMessage = await messageModel
        .findOne({ chatId: chat._id.toString() })
        .sort({ createdAt: -1 });

      const otherUser = chat.members.find((m) => m._id.toString() !== userId);

      result.push({
        chatId: chat._id,
        members: chat.members,
        otherUser,
        lastMessage,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching chats with last messages:", error);
    res.status(500).json({
      message: "Error fetching chats with last messages",
      error: error.message,
    });
  }
};
module.exports = {
  createChatRequest,
  findUserChats,
  findChat,
  findUserChatsWithLastMessage,
  acceptChatRequest,
  inComingChatRequests,
  rejectChatRequest,
};
