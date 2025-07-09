const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const chatModel = require("../models/chatModel");

const createToken = (_id) => {
  const jwtkEY = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkEY, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json("User with the given email already exist!");
    }
    if (!name || !email || !password) {
      return res.status(400).json("All fields are required!");
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json("Email must be a validate email!");
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("Password must be strong!");
    }

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.save();

    const token = createToken(user._id);
    res.status(200).json({
      message: "Registration is successful!",
      _id: user._id,
      name,
      email,
      token,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json("Invalid email or password...!");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json("Invalid email or password...!");
    }

    const token = createToken(user._id);
    res.status(200).json({
      message: "Login is successful!",
      _id: user._id,
      name: user.name,
      email,
      token,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json("User doesn not exists!");
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};

//Get Users
const getUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};

const mongoose = require("mongoose");

const getPotentialChatsUser = async (req, res) => {
  try {
    const currentUserId = req.params.userId;

    if (!currentUserId) {
      return res.status(400).json("User ID is required.");
    }

    const currentUser = await userModel.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json("Current user not found.");
    }

    const existingChats = await chatModel.find({
      members: { $in: [currentUserId] },
    });

    const existingChatUserIds = existingChats.flatMap((chat) =>
      chat.members
        .filter((id) => id.toString() !== currentUserId)
        .map((id) => new mongoose.Types.ObjectId(id)) 
    );

    const youBlocked = currentUser.blockedUsers.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const blockedYouUsers = await userModel.find({
      blockedUsers: currentUser._id,
    }).select("_id");

    const blockedYou = blockedYouUsers.map((user) => user._id);

    const excludedIds = [
      ...youBlocked,
      ...blockedYou,
      ...existingChatUserIds,
      new mongoose.Types.ObjectId(currentUserId), 
    ];

    const potentialUsers = await userModel.find({
      _id: { $nin: excludedIds },
    }).select("name email createdAt updatedAt").sort({ name: 1 });

    res.status(200).json(potentialUsers);
  } catch (error) {
    console.error("Error fetching potential chats:", error);
    res.status(500).json({
      message: "Error fetching potential chats",
      error: error.message,
    });
  }
};


// Block a user
const blockUser = async (req, res) => {
  const { blockerId, blockedId } = req.body;

  if (blockerId === blockedId) {
    return res.status(400).json("You cannot block yourself.");
  }

  try {
    const blocker = await userModel.findById(blockerId);
    const blocked = await userModel.findById(blockedId);

    if (!blocker || !blocked) {
      return res.status(404).json("User not found.");
    }

    if (blocker.blockedUsers.includes(blockedId)) {
      return res.status(400).json("User already blocked.");
    }

    blocker.blockedUsers.push(blockedId);
    await blocker.save();

    res.status(200).json("User blocked successfully.");
  } catch (error) {
    console.log("Error blocking user:", error);
    res.status(500).json("Internal server error.");
  }
};

// Unblock a user
const unblockUser = async (req, res) => {
  const { blockerId, blockedId } = req.body;

  if (blockerId === blockedId) {
    return res.status(400).json("You cannot unblock yourself.");
  }

  try {
    const blocker = await userModel.findById(blockerId);
    const blocked = await userModel.findById(blockedId);

    if (!blocker || !blocked) {
      return res.status(404).json("User not found.");
    }

    if (!blocker.blockedUsers.includes(blockedId)) {
      return res.status(400).json("User is not blocked.");
    }

    blocker.blockedUsers = blocker.blockedUsers.filter(
      (id) => id.toString() !== blockedId.toString()
    );
    await blocker.save();

    res.status(200).json("User unblocked successfully.");
  } catch (error) {
    console.log("Error unblocking user:", error);
    res.status(500).json("Internal server error.");
  }
};

// Get blocked users for a specific user
const getBlockedUsers = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel
      .findById(userId)
      .populate("blockedUsers", "name email createdAt");

    if (!user) {
      return res.status(404).json("User not found.");
    }

    res.status(200).json(user.blockedUsers);
  } catch (error) {
    console.log("Error fetching blocked users:", error);
    res.status(500).json("Internal server error.");
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  blockUser,
  unblockUser,
  getBlockedUsers,
  getPotentialChatsUser,
};
