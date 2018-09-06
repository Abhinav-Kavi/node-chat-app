var socket = io();
var messageTextbox = $('[name=message]');

function scrollToBotttom(){
  //Selectors
  var messages = $("#messages");
  var newMessage = messages.children("li:last-child");

  //Heights
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
    messages.scrollTop(scrollHeight);

}

socket.on("connect",function(){
  console.log("Connected to server");
  var params = $.deparam(window.location.search);
  socket.emit("join",params,function(err){
    if(err){
      alert(err);
      window.location.href = "/";
    }
     
    else
     console.log("No error");
  });
});

socket.on("newMessage", function(message){
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = $("#message-template").html();
  var html = Mustache.render(template,{
    text : message.text,
    from:  message.from,
    createdAt : formattedTime
  });  

  $("#messages").append(html);
  scrollToBotttom();
});

socket.on("newLocationMessage",function(message){
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = $("#location-message-template").html();
  var html = Mustache.render(template,{
    url : message.url,
    from:  message.from,
    createdAt : formattedTime
  })
  
  $("#messages").append(html);
  scrollToBotttom();
});

socket.on("disconnect",function() {
  console.log("Disconnected from server");
});

socket.on("updateUserList", function(userList){
  var ol = $("<ol></ol>");
  console.log(userList);
  userList.forEach(name => ol.append($("<li></li>").text(name)));

  $("#users").html(ol);
})

$("#message-form").on("submit",function(e){
  e.preventDefault();

  socket.emit("createMessage",{
    from : `User`,
    text: `${messageTextbox.val()}`
  }, function(data){     
    messageTextbox.val('');
  });
});

var btnSendLocation = $("#send-location");

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