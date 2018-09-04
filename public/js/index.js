let socket = io();

socket.on("connect",function(){
  console.log("Connected to server");

  socket.emit("createMessage",{
    from: "Abhinav",
    text: "Hey there!"
  });
});

socket.on("newMessage", function(message){
  console.log("New Message : ", message);
})

socket.on("disconnect",function() {
  console.log("Disconnected from server");
});