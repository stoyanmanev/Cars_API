const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (_, response) => {
  response.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log(socket.id);
  io.emit("hey", "Message");
});

server.listen(8000, () => {
  console.log("listening on *:8000");
});

//////////////////////////////////////////
// client

{/* <script src="/socket.io/socket.io.js"></script>;
var socket = io();

///////////////////////
/// client to server

socket.emit("event-name", params)


/////////////////////
/// server to client

socket.on("event-name", (mes) => {
  console.log(mes);
}); */}
