const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error creating chat", error });
  }
};


const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const currentUser = await userModel.findById(userId).select("blockedUsers");
    const blockedIds = currentUser.blockedUsers.map((id) => id.toString());

    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    const filteredChats = chats.filter((chat) => {
      const otherMember = chat.members.find(
        (member) => member.toString() !== userId
      );
      if (!otherMember) return false;

      return !blockedIds.includes(otherMember.toString());
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
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};

const findUserChatsWithLastMessage = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.aggregate([
      { $match: { members: userId } },
      {
        $lookup: {
          from: "messages",
          let: { chatId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          members: 1,
          lastMessage: 1,
        },
      },
    ]);

    res.status(200).json(chats);
  } catch (error) {
    console.error("Aggregation error:", error);
    res
      .status(500)
      .json({ message: "Error fetching chats", error: error.message });
  }
};

module.exports = {
  createChat,
  findUserChats,
  findChat,
  findUserChatsWithLastMessage,
};
