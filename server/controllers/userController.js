const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkEY = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkEY, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    console.log("req", req.body);
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
    res.status(200).json({ _id: user._id, name, email, token });
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
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    let user = await userModel.findById(userId);
    res.status(200).json(user);
    if (!user) {
      res.status(400).json("User doesnot exists!");
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json(error);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
