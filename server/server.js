const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname , '../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));


io.on("connection", (socket)=>{
  console.log("New user connected");

  socket.emit("newMessage", {
    from : "Raj",
    text: "Meet at 6pm",
    createdAt : 131
  });


  socket.on("createMessage", (message)=>console.log("Create Message : ", message));
  socket.on("disconnect", ()=> console.log("User was disconnected"));
});



server.listen(port, ()=> console.log(`Server started on port ${port} ...`));