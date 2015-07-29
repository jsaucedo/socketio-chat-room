var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/nick.html');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //on connection emit message
  io.emit('connection message', 'a new user is connected');
  //on disconnect event emit message
  socket.on('disconnect', function(){
    io.emit('connection message', 'a user disconnected');
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
