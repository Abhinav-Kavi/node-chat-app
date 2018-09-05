const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require("./utils/message");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname , '../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));


io.on("connection", (socket)=>{
  console.log("New user connected");
   
  socket.emit("newMessage",generateMessage("Admin","Welcome to the chat app"));

  socket.broadcast.emit("newMessage",generateMessage("Admin","New user joined"));

  socket.on("createMessage", (message,callback)=>{
    console.log("Create Message : ", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("Message was created successfully!");
  });

  socket.on("createLocationMessage",(coords)=>{
    io.emit("newLocationMessage", generateLocationMessage("Admin",coords.latitude ,coords.longitude));
  });

  socket.on("disconnect", ()=> console.log("User was disconnected"));
});



server.listen(port, ()=> console.log(`Server started on port ${port} ...`));