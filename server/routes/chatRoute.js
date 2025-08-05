const express = require("express");
const router = express.Router();
const {
  createChatRequest,
  findUserChats,
  findChat,
  findUserChatsWithLastMessage,
  acceptChatRequest,
  inComingChatRequests,
} = require("../controllers/chatController");

router.post("/", createChatRequest);
router.post("/acceptChatRequest/:requestId", acceptChatRequest);
router.get("/inComingChatRequests/:userId", inComingChatRequests);
router.get("/:userId", findUserChats);
router.get("/findChat/:firstId/:secondId", findChat);
router.get("/withLastMessage/:userId", findUserChatsWithLastMessage);

module.exports = router;
