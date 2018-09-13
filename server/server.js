const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const request = require('request');

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname , '../public');
const secretKey = '6LcgAXAUAAAAAMHHpJLLgDfAPS3uD_1FnGCYWYk4';

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));


app.post('/', (req,res)=>{
  let captcha = req.body.captcha;
  if(captcha === undefined || captcha === '' || captcha === null)
    return res.json({success : false , message : "Please select captcha"});

  let verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;

  request(verifyUrl,(err,response,body)=>{
    body = JSON.parse(body);
    console.log(body);
    if(body.success !== undefined && !body.success)
      return res.json({success : false , message : "Captcha verification failed!"});

    return res.json({success : true , message : "Captcha verification passed!"});
  });
});


io.on("connection", (socket)=>{
  console.log("New user connected");

  socket.on("join",(params, callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room))
      return callback("Name and room name is required to join");

    params.room = params.room.toLowerCase();
    socket.join(params.room);
    console.log(params);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name , params.room);
    io.to(params.room).emit("updateUserList",users.getUserList(params.room));
    
    socket.emit("newMessage",generateMessage("Admin","Welcome to the chat app"));
    socket.broadcast.to(params.room).emit("newMessage",generateMessage("Admin",`${params.name} has joined!`));

    callback();
  });

  socket.on("createMessage", (message,callback)=>{
    let user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
      return callback();
    }
    callback("Error occured while creating message");
  });

  socket.on("createLocationMessage",(coords)=>{
    let user = users.getUser(socket.id);
    if(user)
      io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name,coords.latitude ,coords.longitude));   
  });

  socket.on("disconnect", ()=>{
    console.log("User was disconnected");
    let user = users.removeUser(socket.id);
    
    if(user){
      io.to(user.room).emit("updateUserList",users.getUserList(user.room));
      socket.broadcast.to(user.room).emit("newMessage",generateMessage("Admin",`${user.name} has left!`)); 
    }   
  });
});



server.listen(port, ()=> console.log(`Server started on port ${port} ...`));