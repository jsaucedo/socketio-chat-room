var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var online_users_chat = [];
var online_users_school = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/nick.html');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

schoolSocket = io.of('/school'),
chatSocket = io.of('/chat');



schoolSocket.on('connection', function(socket){
  //on connection broadcast message to other connected users
  socket.broadcast.emit('connection', {connected: true, user: socket.handshake.query.user, namespace: schoolSocket.name +' namespace'});
    //for (i = 0; i < online_users.length; i++) {
  //  console.log({connected: true, user: online_users[i]});
    //io.to(socket.id).emit('connection', {connected: true, user: online_users[i]});
  //}

  //add user to online users
  online_users_school.push(socket.handshake.query.user);

  socket.on('ready', function() {
    online_users_school.forEach(function(user, index) {
      socket.emit('connection', {connected: true, user: user, namespace: schoolSocket.name +' namespace'});
    });
  });

  //on disconnect event broadcast message to other connected users
  socket.on('disconnect', function(){
    //remove user from online users
    socket.broadcast.emit('connection', {connected: false, user: socket.handshake.query.user});
    online_users_school.splice(online_users_school.indexOf(socket.handshake.query.user), 1);
  });

  //on chat message, broadcast to everyone but sender
  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg);
  });

  //on typing, broadcast everyone but typer
  socket.on("typing", function(data) {
      socket.broadcast.emit("typing", {typing: data.typing, msg: data.who + ' is typing..'});
  });
});

chatSocket.on('connection', function(socket){
  //on connection broadcast message to other connected users
  socket.broadcast.emit('connection', {connected: true, user: socket.handshake.query.user, namespace: chatSocket.name +' namespace'});

  //for (i = 0; i < online_users.length; i++) {
  //  console.log({connected: true, user: online_users[i]});
    //io.to(socket.id).emit('connection', {connected: true, user: online_users[i]});
  //}

  //add user to online users
  online_users_chat.push(socket.handshake.query.user);

  socket.on('ready', function() {
    online_users_chat.forEach(function(user, index) {
      socket.emit('connection', {connected: true, user: user, namespace: chatSocket.name +' namespace'});
    });
  });

  //on disconnect event broadcast message to other connected users
  socket.on('disconnect', function(){
    //remove user from online users
    socket.broadcast.emit('connection', {connected: false, user: socket.handshake.query.user});
    online_users_chat.splice(online_users_chat.indexOf(socket.handshake.query.user), 1);
  });

  //on chat message, broadcast to everyone but sender
  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg);
  });

  //on typing, broadcast everyone but typer
  socket.on("typing", function(data) {
      socket.broadcast.emit("typing", {typing: data.typing, msg: data.who + ' is typing..'});
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
