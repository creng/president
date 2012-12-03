var socket;


$(document).ready(function(){
var viewObject = new PresidentView();

$('#loginForm').hide();

//sets this users id
socket = io.connect();

socket.on('socketId',function(socketId){
	socket.id=socketId;
});

//getPlayers
socket.emit("getLobby",socket.id);
//init lobby menu
socket.on('lobbyPlayers',function(players){
	viewObject.initLobbyMenu(players);
});

socket.on('userLogin',function(uname){
	viewObject.addToLobby(uname);
})


viewObject.setupGameConsole(socket);


//handles resizing of gameconsole
(function HandleResize(){
	$('#GameWidget').resize(function(){
		viewObject.adjustPositionsAndHeights();
	});
})();

});