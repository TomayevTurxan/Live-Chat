const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  blockUser,
  getPotentialChatsUser
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/findUser/:userId", findUser);
router.get("/", getUsers);
router.post("/blockUser", blockUser);
router.get("/potentialChatsUser/:userId", getPotentialChatsUser);

module.exports = router;
