const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const { Server } = require("socket.io");

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const messageModel = require("./models/messageModel");
const chatModel = require("./models/chatModel");

const app = express();
require("dotenv").config();

//APP USE
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

//CRUD
app.get("/", (req, res) => {
  res.send("Welcome");
});

const port = process.env.PORT;

const expressServer = app.listen(port, (req, res) => {
  console.log(`Server running on port..: ${port}`);
});

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDb Connected Succesfully!"))
  .catch((error) => console.log("MongoDb Connected Failed", error.message));

//socket
const io = new Server(expressServer, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});
let onlineUsers = [];

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", async (message) => {
    try {
      const savedMessage = await messageModel.create({
        chatId: message.chatId,
        senderId: message.senderId,
        text: message.text,
        isRead: false,
      });

      const chat = await chatModel.findById(message.chatId);
      if (!chat) return;

      chat.members.forEach((memberId) => {
        const user = onlineUsers.find((u) => u.userId === memberId.toString());
        if (user) {
          io.to(user.socketId).emit("getMessage", savedMessage);
          io.to(user.socketId).emit("getNotification", {
            senderId: message.senderId,
            chatId: message.chatId,
            isRead: false,
            date: new Date(),
          });
        }
      });
    } catch (error) {
      console.error("sendMessage socket error:", error);
    }
  });
  socket.on("markAsRead", async ({ chatId, userId }) => {
    try {
      const chat = await chatModel.findById(chatId);
      if (!chat || !chat.members.includes(userId)) {
        return;
      }

      const result = await messageModel.updateMany(
        {
          chatId,
          senderId: { $ne: userId },
          isRead: false,
        },
        { $set: { isRead: true } }
      );

      chat.members.forEach((memberId) => {
        const user = onlineUsers.find((u) => u.userId === memberId.toString());
        if (user) {
          io.to(user.socketId).emit("getMessagesRead", { chatId });
        }
      });
    } catch (error) {
      console.error("markAsRead error:", error);
    }
  });

  socket.on("deleteMessage", async ({ messageId, chatId }) => {
    try {
      const deletedMessage = await messageModel.findByIdAndDelete(messageId);

      if (!deletedMessage) {
        return;
      }

      const senderSocketId = socket.id;
      onlineUsers.forEach((user) => {
        if (user.socketId !== senderSocketId) {
          io.to(user.socketId).emit("messageDeleted", { messageId, chatId });
        }
      });
    } catch (error) {
      console.error("deleteMessage error:", error);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);

    socket.broadcast.emit("callEnded");
  });

  socket.on("editMessage", async ({ messageId, text, chatId }) => {
    try {
      const updatedMessage = await messageModel.findByIdAndUpdate(
        messageId,
        { text },
        { new: true }
      );

      if (!updatedMessage) return;

      onlineUsers.forEach((user) => {
        io.to(user.socketId).emit("messageEdited", {
          message: updatedMessage,
          chatId,
        });
      });
    } catch (error) {
      console.error("editMessage socket error:", error);
    }
  });

  socket.on("callUser", (data) => {
    const user = onlineUsers.find((u) => u.userId === data.userToCall);
    if (user) {
      io.to(user.socketId).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    }
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.broadcast.emit("callEnded");
});
