var j5 = require('johnny-five');
var board = new j5.Board();
var io = require('socket.io-client');
var socketIO = require('socket.io');
var http = require('http');

socketIO.listen('4556');
var socket = io.connect('http://robotfriends.club:4557');
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

		var servo = new j5.Servo({
			pin: 10,
			range: [0,165]
		});

		var dataArray = [];

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
			dataArray.push(data);
		});

		//if the length is greater than 0
		//loop
		//
		function runLoop() {
			setInterval(function() {
				if(dataArray.length > 0) {
					var item = dataArray.shift();
					leds.on();
					if(item === 'forward') {
						forward();
						board.wait(1000, function() {
							stop();
						});
					}
					else if(item === 'right') {
						turnRight();
						board.wait(500, function() {
							stop();
						});
					}
					else if(item === 'left') {
						turnLeft();
						board.wait(500, function() {
							stop();
						});
					}
					else {
						stop();
					}
				}
			}, 1000);
		}
		runLoop();

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