var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


server.listen(3002);

app.post('/new_message', function (req, res) {
  //cm : chat_message
  cm = req.body
  io.to('user' + cm.recv_user_id).emit('new_message', cm);
  res.send({
    state: 'yes'
  })
});

io.on('connection', function (client) {
  var userId = client.handshake.query.userId;
  client.join('user' + userId);
  // from now each client joins his personal group.
  // And you can send a message to user with id=5 like this: 
  // io.to('user5').emit('test', 'hello');

  //client.on('send message', function (send_user_id, data) {
    //data.recv_user_id
  //});

  client.on('disconnect', function () {
    io.emit('user disconnected');
  });
});
