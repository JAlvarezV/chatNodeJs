var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));


connectCounter = 0;

app.get('/', function(req, res){
    res.sendFile('index.html');
});

io.on('connection', function(socket){
    connectCounter++;
    console.log('Se ha conectado un usuario('+connectCounter+').');
    io.emit("new user",connectCounter);

    socket.on("usernameInput" , function (username) {
        socket.username= username;
        console.log("Recibido usuario ("+socket.username+").");
    });

    socket.on("disconnect", function () {
        connectCounter--;
        console.log('Se ha desconectado un usuario('+connectCounter+').');
        console.log('Se ha desconectado el usuario('+socket.username+')');
        io.emit("leaving user",socket.username, connectCounter);

    });

    socket.on("mensaje", function (data) {
        console.log("Se ha recibido el mensaje: "+data.msg+" del usuario "+data.user);
        io.emit("newmsg", data);
    });

    socket.on("writing", function (data) {
        io.emit("user writing", data);
    });
});


http.listen(3000, function(){
    console.log('Escuchando en puerto 3000');
});