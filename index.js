const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const PORT = 8000;

const users = {};

io.on("connection", (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }
  console.log("users:", users);
  console.log("user connected...");
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected...`);
    delete users[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  //emit hey to user that we are calling
});

// app.get("/", (req, res) => {
//   console.log("users:", users);
//   res.json(users);
// });

server.listen(PORT, () => {
  console.log(`Server is up and running on PORT ${PORT}`);
});
