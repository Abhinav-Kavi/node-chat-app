
$("#loginForm").on("submit", function(e){
  e.preventDefault();

  var captcha = $("#g-recaptcha-response").val();
  var name = $("#name").val();
  var room = $("#room").val();


  fetch('/',{
    method : 'POST',
    headers : {
      'Accept' :'application/json',
      'Content-Type': 'application/json'
    },
    body : JSON.stringify({captcha :captcha})
  })
  .then(res => res.json())
  .then(data => {     
    if(data.success)
      window.location.href = `/chat.html?name=${name}&room=${room}`;

    else
      alert(data.message);
  })
  .catch(err => console.log(err));

});
