var j5 = require('johnny-five');
var board = new j5.Board();
var io = require('socket.io-client');
var socketIO = require('socket.io');
var http = require('http');

socketIO.listen('4556');
var socket = io.connect('http://robotfriends.club:4557');
socket.on('connect', function() {

	board.on('ready', function() {
		// var connectionLed = j5.Led(4);
		// connectionLed.on();
		// socket.on('disconnect', function() {
		// 	connectionLed.off();
		// });
		// socket.on('connect', function() {
		// 	connectionLed.on();
		// });
		var motorRight = new j5.Motor({
			pins: {
				pwm: 5,
				dir: 4
			},
			invertPWM: true
		});

		var motorLeft = new j5.Motor({
			pins: {
				pwm: 3,
				dir: 2
			},
			invertPWM: true
		});

		// var leds = new j5.Led(6);

		// var servo = new j5.Servo({
		// 	pin: 10,
		// 	range: [0,165]
		// });

		var dataArray = [];

		function forward() {
			motorRight.forward(255);
			motorLeft.forward(255);
		} 
		function stop() {
			motorRight.stop();
			motorLeft.stop();
			// leds.off();
		}
		function reverse() {
			motorLeft.reverse(255);
			motorRight.reverse(255);
		}
		function turnLeft() {
			motorLeft.forward(255);
		}
		function turnRight() {
			motorRight.forward(255);
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
					// leds.on();
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
					else if(item === 'reverse') {
						reverse();
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
			// led: leds
		});
	});

});