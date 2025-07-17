const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const { Server } = require("socket.io");

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const messageModel = require("./models/messageModel"); // doğru path ilə

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
    origin: [process.env.FRONT_URL],
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});
let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    io.emit("getOnlineUsers", onlineUsers);
  });

  //add Message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        chatId: message.chatId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("markAsRead", async ({ chatId, userId }) => {
    try {
      const result = await messageModel.updateMany(
        {
          chatId,
          senderId: { $ne: userId },
          isRead: false,
        },
        { $set: { isRead: true } }
      );

      const senderUsers = onlineUsers.filter((u) => u.userId !== userId);

      senderUsers.forEach((user) => {
        io.to(user.socketId).emit("getMessagesRead", { chatId });
      });
    } catch (error) {
      console.error("markAsRead error:", error);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});
