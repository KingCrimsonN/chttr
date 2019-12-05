$(document).ready(function() {
    var socket = io.connect();

    var message = $("#message");
    var username = $("#username");
    var password = "";
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var time = "";

    getMessages();

    send_username.click(function() {
        if ($("#password").val() == "" || $("#username").val() == "") {
            alert("Enter both login and password first!");
            return;
        } else {
            if (password == "") {
                password = $("#password").val();
                socket.emit('sign_up', { username: username.val(), password: password })
            } else {
                if (password != $("#password").val()) {
                    alert("Wrong password");
                } else {
                    socket.emit('sign_up', { username: username.val() })
                }
            }
        }
        // document.getElementById('password').value = '';
        // document.getElementById('username').value = '';
    });

    send_message.click(function() {
        if (message.val() != '') {
            var date = new Date();
            var time = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
            sendMessage({ username: username.val(), message: message.val(), time: time })
            socket.emit('new_message', {
                message: message.val(),
                time: time
            })
        }
    })

    socket.on("new_message", function(data) {
        console.log(data);
        addMessages(data);
    })
    $('.send-btn').click(function() {
        document.getElementById('message').value = '';
    })

    function addMessages(data) {
    chatroom.append("<p class = 'message message-text'>" + data.time + " " + data.username + ": " + data.message + "</p>");
};

function getMessages() {
    $.get('/messages', function(data) {
        console.log(data);
        data.forEach(addMessages);
    })
        var temp = document.getElementById("chatroom");
        $("#chatroom").scrollTop(500);
        console.log(temp.scrollHeight);

};

function sendMessage(message) {
    $.post('/messages', message);
}


});

