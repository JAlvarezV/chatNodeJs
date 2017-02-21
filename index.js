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
    socket.broadcast.emit("new user","Se ha conectado un nuevo usuario. Usuarios totales: "+connectCounter);


    socket.on("disconnect", function () {
        connectCounter--;
        console.log('Se ha desconectado un usuario('+connectCounter+').');
        socket.broadcast.emit("leaving user","Se ha desconectado un usuario. Usuarios totales: "+connectCounter);
    });

    socket.on("mensaje", function (data) {
        console.log("Se ha recibido el mensaje: "+data.msg+" del usuario "+data.user);
        io.sockets.emit("newmsg", data);
    });

    socket.on("writing", function (data) {
        io.sockets.emit("user writing", data);
    });
});


http.listen(3000, function(){
    console.log('Escuchando en puerto 3000');
});