

$(function conn(){
	var socket = io.connect('http://localhost:3000');

	var message = $("#message");
	var username = $("#username");
	var password = "";
	var send_message = $("#send_message");
	var send_username = $("#send_username");
	var chatroom = $("#chatroom");

	send_username.click(function(){
		if ($("#password").val()=="" || $("#username").val()==""){
			alert("Enter both login and password first!");
			return;
		}
		else{
			if (password==""){
				password = $("#password").val();
				socket.emit('sign_up', {username: username.val(), password: password})
			}
			else{
				if (password!=$("#password").val()){
					alert("Wrong password");
				}
				else{
					socket.emit('sign_up', {username: username.val()})		
				}
			}
		}
	 		document.getElementById('password').value = '';
	 		document.getElementById('username').value = '';
	});

	send_message.click(function(){
		var date = new Date();
		var time = date.getHours() + ":" + date.getMinutes();
		// console.log(message.val());
		socket.emit('new_message', {
			message: message.val(),
			time: time
		})
	})

	socket.on("new_message", function(data){
		console.log(data);
		chatroom.append("<p class = 'message message-text'>" + data.time + " " + data.username + ": " + data.message + "</p>");
	})
	$('.send-btn').click(function(){
	 document.getElementById('message').value = '';
})
});


