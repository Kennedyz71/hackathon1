const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const nicknames = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

//////////////////////////////////////////////////////

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  // socket.on("chat message", (msg) => {
  //   console.log("message: " + msg);
  // });
  // socket.on("chat message", (data) => {
  //   io.emit("chat message", { msg: data, nick: socket.nickname });
  //   console.log("message: " + { msg: data, nick: socket.nickname });
  // });
  socket.on("new user", function (data, callback) {
    if (nicknames.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      nicknames.push(socket.nickname);
      updateNicknames();
    }
  });
  socket.on("disconnect", (data) => {
    if (!socket.nickname) return;
    nicknames.splice(nicknames.indexOf(socket, nicknames), 1);
  });
});

function updateNicknames() {
  io.emit("usernames", nicknames);
}

// io.emit("some event", {
//   someProperty: "some value",
//   otherProperty: "other value",
// }); // This will emit the event to all connected sockets

//////////////////////////////////////////////////
