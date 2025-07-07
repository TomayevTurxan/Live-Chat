const express = require("express");
const router = express.Router();
const {
  createChat,
  findUserChats,
  findChat,
  findUserChatsWithLastMessage,
} = require("../controllers/chatController");

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/findChat/:firstId/:secondId", findChat);
router.get("/withLastMessage/:userId", findUserChatsWithLastMessage);

module.exports = router;
