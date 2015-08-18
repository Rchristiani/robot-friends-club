var j5 = require('johnny-five');
var board = new j5.Board();
var io = require('socket.io-client');
var socketIO = require('socket.io');
var http = require('http');

socketIO.listen('4556');
var socket = io.connect('http://localhost:4557');
socket.on('connect', function() {

	board.on('ready', function() {
		var connectionLed = j5.Led(4);
		connectionLed.on();
		socket.on('disconnect', function() {
			connectionLed.off();
		});
		socket.on('connect', function() {
			connectionLed.on();
		});
		var motorRight = new j5.Motor({
			pin: 5 
		});

		var motorLeft = new j5.Motor({
			pin: 3
		});

		var leds = new j5.Led(6);

		function forward() {
			motorRight.start(255);
			motorLeft.start(255);
		} 
		function stop() {
			motorRight.stop();
			motorLeft.stop();
			leds.off();
		}
		function reverse() {
			motorLeft.reverse();
			motorRight.reverse();
		}
		function turnLeft() {
			motorLeft.start();
		}
		function turnRight() {
			motorRight.start();
		}

		socket.on('robot:direction', function(data) {
			leds.on();
			if(data === 'forward') {
				forward();
				board.wait(1000, function() {
					stop();
				});
			}
			else if(data === 'right') {
				turnRight();
				board.wait(500, function() {
					stop();
				});
			}
			else if(data === 'left') {
				turnLeft();
				board.wait(500, function() {
					stop();
				});
			}
			else {
				stop();
			}
			
		});

		socket.on('robot:arm', function(data) {

		});

		board.repl.inject({
			motorRight: motorRight,
			motorLeft: motorLeft,
			forward: forward,
			reverse: reverse,
			turnLeft: turnLeft,
			turnRight: turnRight,
			stop: stop,
			led: leds
		});
	});

});