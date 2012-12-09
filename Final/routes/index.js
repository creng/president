exports.index = function (req, res) {
  res.render('index', { title: 'President' });
};

var users = {};
var usernames = {};
var io;

exports.init = function (socket, i) {

	io = i;

	socket.on('Login', function (data) {
		if (users[data] === undefined){
			users[data] = socket;
			socket.emit('Play', usernames);
			usernames[data] = data;
		}
		else {
			socket.emit('Reject', 'user already exists.');
		}
	});

};

exports.close = function (socket) {
	var user;
	for (var i in users) {
		if (users[i] === socket) {
			user = i;
			delete users[i];
			delete usernames[user];
			break;
		}
	}
};

exports.wait = function (socket) {
	socket.emit('Wait');
};

exports.createGame = function (players, room) {
	for (var i = 0; i < players.length; i++) {
		players[i].join(room);
	}
	io.sockets.in(room).emit('Game', players);
};