

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 8000;

const db_url = "mongodb+srv://Mike_stavr:<password>@chttr-owvzb.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(db_url, function(err){
	console.log('mongodb connected', err);
})

app.set('view engine','ejs');

app.use(express.static('public'));

app.get('/', function(req,res){
	res.render('index');
})

server = app.listen(port);

const io = require("socket.io")(server);

io.on('connection' , function(socket){
	console.log('New User Connected');

	socket.username = "Anon";
	socket.password = "";

	socket.on('sign_up', function(data){
		socket.password = data.password;
		socket.username = data.username;
	})

	socket.on('new_message',function(data){
		io.sockets.emit('new_message', {message : data.message, time: data.time, username : socket.username});
	})
} )