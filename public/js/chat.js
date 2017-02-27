$(document).ready(function () {
    username="";
    escritores = [];
    $('#myModal').modal({
        keyboard: false,
        backdrop: "static",
        show: true
    });


    $('#bt-username').on("click",function (e) {
        e.preventDefault();
        username = $('#i-username').val();
        if(username!=""){
            init_socket();
            if(sendUsername()){
                $('#myModal').modal('hide');
                init_checkWriting();
            }
        }else{
            $('#username-errors').text("Your nick can not be empty!");
        }
    });

});


function init_checkWriting() {
    setInterval(function () {
        if(escritores.length>1){
            $('#users-writing').html("<p>"+escritores.toString()+" are writing..."+"</p>");
        }else if(escritores.length==1){
            $('#users-writing').html("<p>"+escritores.toString()+" is writing..."+"</p>");
        }
        else{
            $('#users-writing').html("");
        }
            escritores = [];

    },1000);
}

function init_socket() {
    socket = io();
    socket.on("newmsg", function (data) {
        var date = new Date();
        var time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        var tmpli=$('<li></li>');
        if(data.user == username){
            tmpli =  $("<li></li>").addClass('i');

        }else{
            tmpli =  $("<li></li>").addClass('not-own-message');
        }

        var tmpDivHead = $('<div></div>').addClass('head').append($('<span></span>').addClass('time').text(" "+time+" ")).append($('<span></span>').addClass('name').text(" "+data.user));
        var tmpDivMsg = $('<div></div>').addClass('message').text(data.msg);

        tmpli.append(tmpDivHead);
        tmpli.append(tmpDivMsg);


        $('#chat-area').append(tmpli);
    });

    socket.on("new user",function (data) {
        var tmp = $('<p></p>');
        tmp.text(data+" usuarios conectados");
        $('#users-count').html(tmp);
    });

    socket.on("leaving user",function (nick,count) {
        var tmp = $('<p></p>');
        tmp.text(count+" usuarios conectados");
        $('#users-count').html(tmp);
        //Poner en el chat quien se ha pirado

    });

    socket.on("user writing",function (data) {
       //Check if the received user is already in the array to do not duplicate
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


    $('#message-input').keydown(function (e) {
        if(e.keyCode==13){
             sendMessage();
        }
        socket.emit("writing",username);
    });

    $('#send-button').click(function () {
       sendMessage();
    });

}

function sendMessage() {
    var msg = {};
    if($.trim($('#message-input').val())!="") {
        msg.user = username;
        msg.msg = $('#message-input').val();
        socket.emit("mensaje", msg);
        $('#message-input').val("");
    }
}


function sendUsername() {
    socket.emit("usernameInput",username);
    return true;
}

