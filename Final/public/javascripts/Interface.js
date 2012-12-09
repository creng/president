var socket;
var user;

$(function () {

	socket = io.connect();

	$('#name').focus();

	$('#login-button').click(function (event) {
		var reg = /[A-Za-z_][A-Za-z_0-9]*/;
		var login_user = $('#name').val();
		if (!login_user || !reg.test(login_user) ){
			$('#name').val('');
			$('div#login-error').html('Please try again, invalid username.');
		}
		else {
			user = login_user;
			socket.emit('Login', user);
		}
		return false;
	});

	socket.on('Play', function (data) {
		$('div#login-form').remove();
	});

	socket.on('Reject', function (data) {
		$('#name').val('');
		$('div#login-error').html('Please try again, ' + data);
	});

	socket.on('Game', function (data) {
		alert('Hey');
	});

});