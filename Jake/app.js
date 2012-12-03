var express = require('express'),
    flash   = require('connect-flash'),
    http    = require('http');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('port', process.env.PORT || 3000);  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(flash());  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/',function(req,res){
  res.sendfile('President.html');
});

//sending of js files that are stored on the server
app.get('/PresidentController.js',function(req,res){
  res.sendfile('PresidentController.js');
})
app.get('/PresidentView.js',function(req,res){
  res.sendfile('PresidentView.js');
})
app.get('/PresidentModel.js',function(req,res){
  res.sendfile('PresidentModel.js');
})
app.get('/socket.io.js',function(req,res){
  res.sendfile('/socket.io/lib/socket.io.js');
})

//create server
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io= require('socket.io', {'log level': 0}).listen(server);

var sockets = new Array();

var socketCounter=0;


//socket handlers for login type stuff
io.sockets.on('connection',function(socket){
  sockets.push(socket);
  socket.emit('socketId', socketCounter);
  socketCounter++;
  socket.on('userLogin',function(data){
    loginUser(data.username,data.id);
});
  socket.on('sendMessage',function(data){
    routes.sendMessage(data.msg,data.reciever,data.sender,sockets);
  })

  socket.on('browserClosed',function(data){
    var uname = data;
    socket.broadcast.emit('browserClosed',uname);
  })

});

//keeps track of mapping of unames to sockets
var socketMapping = new Array();
var userNames = new Array();

//checks if user already exists and updates appropriate data structures (Can be moved to a different js file late for orginizational purposes)
function loginUser(uname,socketId){
  var valid=true;
  console.log(socketId);
  console.log(sockets);
  var socket = sockets[socketId];
  for(var i =0;i<userNames.length;i++){
    if(userNames[i]==uname){
      valid=false;
      break;
    }
  }
  if(valid){
    userNames.push(uname);
    userNames.sort();
    socketMapping.push({userName:uname,socketId:socketId});
    socket.broadcast.emit('userLogin',uname);
    socket.emit('loginSuccess',userNames);
  }
  else{
    socket.emit('userReject');
  }
}