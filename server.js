var http = require('http');
var socket = require('socket.io');
var express = require('express');
var app = express();
var server = http.createServer(app);

app.use(express.static('.'));

app.get('/', function(req,res) {});

var io = socket(server);

var connectedUsers = 0;

io.on('connection', function(socket) {
	connectedUsers += 1;
	socket.emit('connectedUser', connectedUsers);
	socket.on('direction', function(data) {
		console.log(data);
		io.emit('robot:direction',data.direction);
	});
	socket.on('disconnect', function() {
		console.log('disconnect');
		connectedUsers -= 1;
		socket.emit('connectedUser', connectedUsers);
	});
});


io.listen(4557);

app.listen(4555);
console.log('Listening on port 4555');



