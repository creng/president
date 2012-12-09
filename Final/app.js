var express = require('express')
  , routes = require('./routes')
  , flash   = require('connect-flash')
  , http = require('http')
  , path = require('path')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var queuedPlayers = [];
var roomNumber = 1;

io.sockets.on('connection', function (socket) {
  routes.init(socket, io);
  queuedPlayers.push(socket);
  if (queuedPlayers.length === 4){
    routes.createGame(queuedPlayers, roomNumber);
  }
  socket.on('disconnect', function () {
    routes.close(socket);
  });
});

server.listen(3000);