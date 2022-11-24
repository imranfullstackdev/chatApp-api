const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
const db = require("./db/db");
const socket = require("socket.io");
app.use(cors());



app.use("/", require("./router/router.js"));
app.use("/messages", require("./router/messagesrouter.js"));
const server = app.listen(process.env.PORT, () => {
  console.log("app is listening at 8000");
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
