$(document).ready(function() {
    var socket = io.connect();

    var message = $("#message");
    var username = $("#username");
    var password = "";
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var time = "";
    var id = 0;

    getMessages();

    send_username.click(function() {
        alert("Username successfuly changed");
        if (username.val() == "sys_adm_flvsy!#") {
            alert("ADMIN TIME");
            document.getElementById('username').value = 'A D M I N';
            socket.emit('sign_up', { username: username.val(), password: "sys_adm_flvsy!#" })
        } else
            socket.emit('sign_up', { username: username.val() })
        // document.getElementById('password').value = '';
        // document.getElementById('username').value = '';
    });

    send_message.click(function() {
        if (message.val() != '') {
            var date = new Date();
            var time = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
            sendMessage({ id: id, username: username.val(), message: message.val(), time: time })
            id++;
            socket.emit('new_message', {
                message: message.val(),
                time: time
            })
        }
    })



    socket.on("new_message", function(data) {
        addMessages(data);
        chatroom.scrollTop(chatroom.prop("scrollHeight"));
    })

    $('.send-btn').click(function() {
        document.getElementById('message').value = '';
    })


    $('#chatroom').on('click', '.message', function(event) {
        var idd = $(this).data('id');
        socket.emit('remove_message', {
            username: $(this).data('name'),
            time : $(this).data('time')
        })
    })

    function addMessages(data) {
        $('<p>').addClass('message message-text').attr({
            'data-name': data.username,
            'data-time': data.time,
            'data-id': data.id,
        }).text(data.time + " " + data.username + ": " + data.message).appendTo(chatroom);
        // chatroom.append("<p class = 'message message-text' data-name='" + data.username + "'' data-time='" + data.time  + 
        //     "' data-id='" + data.id + "'>" + data.time + " " + data.username + ": " + data.message + "</p>");
        id = data.id;
    };

    function getMessages() {
        $.get('/messages', function(data) {
            data.forEach(addMessages);
            $("#chatroom").scrollTop($("#chatroom").prop("scrollHeight"));
        })
    };

    function sendMessage(message) {
        $.post('/messages', message);
    }

});