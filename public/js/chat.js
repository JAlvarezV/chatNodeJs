var socket = io();
var escritores = [];
$(document).ready(function () {
    userName = prompt("Introduce tu nick");
    setInterval(function () {
        $('#info').html("Usuarios escribiendo: "+escritores.toString());
        escritores = [];
    },750);
});

socket.on("newmsg", function (data) {
    var tmp =  $("<li></li>").html(data.user+": "+data.msg);
    $('#todo-chat').append(tmp);
});

socket.on("new user",function (data) {
    var tmp =  $("<li></li>").html(data);
    $('#todo-chat').append(tmp);
});

socket.on("leaving user",function (data) {
    var tmp =  $("<li></li>").html(data);
    $('#todo-chat').append(tmp);
});

socket.on("user writing",function (data) {
    var valid = true;
    for(var i=0;i<escritores.length;i++){
        if(escritores[i]==data){
            valid = false;
            break;
        }
    }
    if(valid)
        escritores.push(data);
});

$('form').submit(function (e) {
    e.preventDefault();
    var msg = {};
    if($('#i-mensaje').val()!=""){
        msg.user = userName;
        msg.msg = $('#i-mensaje').val();
        socket.emit("mensaje",msg);
        $('#i-mensaje').val("");
    }
});

$('#i-mensaje').keydown(function () {
    socket.emit("writing",userName);
});