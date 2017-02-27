$(document).ready(function () {
    username="";
    escritores = [];
    userStatus= "";

    $('#myModal').modal({
        keyboard: false,
        backdrop: "static",
        show: true
    });

    var images = $('#user-images-selector').find('img');
    selectedImage=$(images[0]);
    $(selectedImage).css("border","2px solid #3a9fc4");
    $(selectedImage).css("border-radius","5px");

    images.click(function (e) {
        if($(selectedImage)!="") {
            $(selectedImage).css("border","");
            selectedImage = $(e.target);
            $(e.target).css("border","2px solid #3a9fc4");
            $(e.target).css("border-radius","5px");
        }
    });

    $('#bt-username').on("click",function (e) {
        e.preventDefault();
        username = $('#i-username').val();
        userStatus = $('#i-status').val();
        if(username!=""){
            $('#user-image').attr("src",selectedImage.attr("src"));
            $('#user-name').text(username);
            $('#user-status').text(userStatus);
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
            $('#chat-info').html("<p>"+escritores.toString()+" are writing..."+"</p>");
        }else if(escritores.length==1){
            $('#chat-info').html("<p>"+escritores.toString()+" is writing..."+"</p>");
        }
        else{
            $('#chat-info').html("");
        }
        escritores = [];


    },1000);
}

function init_socket() {
    socket = io();

    socket.on("newmsg", function (data) {
        var date = new Date();
        var time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        generateMessage(data.user,data.msg,time);
    });

    socket.on("new user",function (username,status,uimage,connectCounter) {
        //New user joined chat. Create sidebar info, show total users and generate info message in the chat
        generateFriend(username,status,uimage)
        $('#chat-connected-users').html("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span>"+" "+connectCounter);
        generateMessageSystem("User "+username+" connected!");
    });

    socket.on("leaving user",function (nick,count) {
        $('#chat-connected-users').html("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span>"+" "+count);
        generateMessageSystem("User "+nick+" disconnected!");
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

    socket.on("update users",function (data) {
        console.log(data);
        clearFriendList();
        for(var i=0;i<data.length;i++){
            generateFriend(data[i][0],data[i][1],data[i][2]);
        }

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
    socket.emit("usernameInput",username,userStatus,selectedImage.attr("src"));
    return true;
}

function generateFriend(uname,uimage,status+ç) {
    if(uname!=username){
        var df = $('<div></div>').addClass("friend col-xs-12");
        var df2 = $('<div></div>').addClass("col-xs-3");
        var img1 = $('<img>').addClass("img-circle").attr("src",uimage);
        df2.append(img1);
        var df3 = $('<div></div>').addClass("col-xs-9");
        var p1 = $('<p></p>').addClass("friend-name").text(uname);
        var p2 = $('<p></p>').addClass("friend-status").text(status);
        df3.append(p1);
        df3.append(p2);
        df.append(df2);
        df.append(df3);
        $('#friends-container').append(df);
    }
}

function clearFriendList() {
    $('#friends-container').empty();
}

function generateMessage(uname,msg,time) {
    var type = "";
    if(uname == username){
        type="message-o";
    }else{
        type="message-f";
    }

    var mcontainer = $('<div></div>').addClass("message-container col-xs-12");
    var messagetype = $('<div></div>').addClass(type);
    var mhead = $('<div></div>').addClass("header");
    var mheadcontent = $('<p></p>').addClass("message-username").html("<strong>"+uname+"</strong>"+"<small><span class='glyphicon glyphicon-time' aria-hidden='true'></span> "+time+"</small>");

    var separator = $('<div></div>').html("<hr>");
    var cont = $('<div></div>').addClass("content").append($("<p></p>").text(msg));

    mhead.append(mheadcontent);
    messagetype.append(mhead);
    messagetype.append(separator);
    messagetype.append(cont);
    mcontainer.append(messagetype);

    $('#chat-area').append(mcontainer);
}

function generateMessageSystem(msg) {
    var mcontainer = $('<div></div>').addClass("message-container col-xs-12");
    var messagetype = $('<div></div>').addClass("message-s");
    var cont = $('<div></div>').addClass("content").append($("<p></p>").text(msg));
    messagetype.append(cont);
    mcontainer.append(messagetype);
    $('#chat-area').append(mcontainer);
}

