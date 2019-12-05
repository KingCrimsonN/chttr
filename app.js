const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');

const port = process.env.PORT || 8000;

var Message = mongoose.model('Messages', {
    username: String,
    message: String,
    time: String
})

const uri = "mongodb+srv://Mike_stavr:mi13ke07@chttr-owvzb.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, function(err) {
    console.log("mongo connected", err);
});

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))



app.use(express.static('public'));


app.get('/', function(req, res) {
    res.render('index');
})

app.get('/messages', function(req, res) {
	console.log("get" + req);
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.post("/messages", async (req, res) => {
    try {
        var message = new Message(req.body)
        await message.save()
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})


server = app.listen(port);

const io = require("socket.io")(server);

io.on('connection', function(socket) {
    console.log('New User Connected');

    socket.username = "Anon";
    socket.password = "";

    socket.on('sign_up', function(data) {
        socket.password = data.password;
        socket.username = data.username;
    })

    socket.on('new_message', function(data) {
        io.sockets.emit('new_message', { message: data.message, time: data.time, username: socket.username });
    })

    socket.on('remove_message', function(data){
        if (admin()){
            Message.findOneAndDelete({id:data.id});
        }
    })

    function admin(){
        if (password == "sys_adm_flvsy!#")
            return true;
        return false;
    }
})


// io.on('disconection', function(socket){
// 	console.log('User disconnected');
// })