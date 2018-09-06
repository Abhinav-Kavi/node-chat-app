let socket = io();
let messageTextbox = $('[name=message]');

socket.on("connect",function(){
  console.log("Connected to server");
});

socket.on("newMessage", function(message){
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = $("#message-template").html();
  let html = Mustache.render(template,{
    text : message.text,
    from:  message.from,
    createdAt : formattedTime
  });  

  $("#messages").append(html);
});

socket.on("newLocationMessage",function(message){
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = $("#location-message-template").html();
  let html = Mustache.render(template,{
    url : message.url,
    from:  message.from,
    createdAt : formattedTime
  })
  
  $("#messages").append(html);
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