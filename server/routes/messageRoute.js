const express = require("express");
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages);
router.delete("/:messageId", deleteMessage);
module.exports = router;
