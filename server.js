var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = process.env.PORT || '5000';
const PUBLIC = '/public';

app.use(express.static(__dirname+PUBLIC));

var connectCounter = 0;
var clients = [];
app.get('/', function(req, res){
    res.sendFile('index.html');
});

io.on('connection', function(socket){
    connectCounter++;
    console.log('Se ha conectado un usuario('+connectCounter+').');

    socket.on("usernameInput" , function (username,status,image) {
        socket.username = username;
        socket.userimage = image;
        socket.status= status;
        clients.push([username,image,status]);
        io.emit("new user",username,image,status,connectCounter);
        io.emit("update users",clients);
        console.log("Recibido usuario ("+socket.username+"). Estado: "+socket.status+" Imagen: "+socket.userimage);
    });

    socket.on("disconnect", function () {
        connectCounter--;
        console.log('Se ha desconectado un usuario('+connectCounter+').');
        console.log('Se ha desconectado el usuario('+socket.username+')');
        if(clients.length<=1){
            clients = [];
        }else{
            for(var i=0;i<clients.length;i++){
                if(clients[i][0]==socket.username){
                    clients = clients.slice(i,1);
                    break;
                }
            }
        }
        io.emit("leaving user",socket.username, connectCounter);
        io.emit("update users",clients);
    });

    socket.on("mensaje", function (data) {
        console.log("Se ha recibido el mensaje: "+data.msg+" del usuario "+data.user);
        io.emit("newmsg", data);
    });

    socket.on("writing", function (data) {
        io.emit("user writing", data);
    });

    socket.on("getUsers", function () {
        io.sockets
       socket.emit()
    });

});



http.listen(PORT, function(){
    console.log('Escuchando en puerto '+PORT);
});