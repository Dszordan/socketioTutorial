var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

var currentUsers = [];
io.on('connection', function(socket){
	console.log('a user connected ' + socket.request.headers.host);
	var currentUser = {ipAddress: socket.request.headers.host, username:'Anonymous'};
	currentUsers.push(currentUser);
	io.emit('user list updated', currentUsers);

	socket.on('disconnect', function(){
		console.log('user disconnected ' + currentUser.username);
		io.emit('user list updated', currentUsers);
		for (var i = 0; i < currentUsers.length; i++) {
			if (currentUsers[i].ipAddress == socket.request.headers.host) {
				currentUsers.splice(i,1);
			};
		};
	});

	socket.on('set username', function(username){
		console.log('username changes : ' + username);
		currentUser.username = username;
		io.emit('user list updated', currentUsers);
	})

	socket.on('chat message', function(msg){
		var message = {username:currentUser.username, text:msg}
		io.emit('chat message', message);
	});
});

http.listen(3000, function(){
	console.log('listening on 3000');
});