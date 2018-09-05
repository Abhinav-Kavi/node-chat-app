let socket = io();
let messageTextbox = $('[name=message]');

socket.on("connect",function(){
  console.log("Connected to server");
});

socket.on("newMessage", function(message){
  console.log("New Message : ", message);

  let li = $("<li></li>");
  li.text(`${message.from} : ${message.text}`);
  $("#messages").append(li);
});

socket.on("newLocationMessage",function(message){
  let li = $("<li></li>");
  let a = $("<a target='_blank'>My current location</a>");
  a.attr('href',message.url);
  li.text(`${message.from} : `);
  li.append(a);
  $("#messages").append(li);
});

socket.on("disconnect",function() {
  console.log("Disconnected from server");
});

$("#message-form").on("submit",function(e){
  e.preventDefault();

  socket.emit("createMessage",{
    from : `User`,
    text: `${messageTextbox.val()}`
  }, function(data){     
    messageTextbox.val('');
  });
});

let btnSendLocation = $("#send-location");

btnSendLocation.on("click", function(){
  if(!navigator.geolocation)
   return alert("Geolocation is not supported by your browser");

  btnSendLocation.attr('disabled','disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position){
    btnSendLocation.removeAttr('disabled').text('Send location');
    socket.emit("createLocationMessage",{
      latitude : `${position.coords.latitude}`,
      longitude: `${position.coords.longitude}`
    });
  },
    function(){
      btnSendLocation.removeAttr('disabled').text('Send location');
      alert("Unable to get geolocation");
  });
});