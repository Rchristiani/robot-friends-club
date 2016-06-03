'use strict';

var url = window.location.hostname;
var socket = io('http://' + url + ':4557');

var Header = React.createClass({
	displayName: 'Header',

	getInitialState: function getInitialState() {
		return {
			connected: 0,
			modalClass: ''
		};
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		socket.on('connectedUser', function (data) {
			_this.setState({
				connected: data
			});
		});
	},
	showInfo: function showInfo() {},
	render: function render() {
		return React.createElement(
			'header',
			null,
			React.createElement(
				'div',
				{ className: 'logo-container' },
				React.createElement('img', { src: 'robot.svg' }),
				React.createElement(
					'h1',
					null,
					'Robot Friends Club'
				)
			),
			React.createElement(
				'span',
				null,
				'Connected users: ',
				this.state.connected
			)
		);
	}
});

var CommandPrompt = React.createClass({
	displayName: 'CommandPrompt',

	getInitialState: function getInitialState() {
		return {
			command: '',
			commands: [],
			userCommands: []
		};
	},
	componentDidMount: function componentDidMount() {
		var _this2 = this;

		socket.on('robot:direction', function (data) {
			var commands = _this2.state.commands;
			commands.push(data);
			_this2.setState({
				commands: commands
			});
		});
	},
	enterCommand: function enterCommand(e) {
		e.preventDefault();
		var pattern = /left|right|forward|brake|reverse/;
		var userCommands = this.state.userCommands;
		if (this.state.command.match(pattern)) {
			socket.emit('direction', { direction: this.state.command });
			userCommands.push('$~friend: ' + this.state.command);
		} else {
			userCommands.push('$~friend: ' + this.state.command + ' command not found');
		}
		this.setState({
			command: '',
			userCommands: userCommands
		});
	},
	onChange: function onChange(e) {
		this.setState({
			command: e.target.value.toLowerCase()
		});
	},
	render: function render() {
		return React.createElement(
			'section',
			{ className: 'prompt-container' },
			React.createElement(
				'div',
				{ className: 'prompt-left prompt' },
				React.createElement(
					'div',
					{ className: 'prompt-line' },
					React.createElement(
						'span',
						{ className: 'prompt-icon' },
						' $~friend:'
					),
					React.createElement(
						'form',
						{ onSubmit: this.enterCommand },
						React.createElement('input', { type: 'text', value: this.state.command, onChange: this.onChange })
					)
				),
				React.createElement(
					'ul',
					null,
					function (list, context) {
						var commands = context.state.userCommands;
						for (var i = 0; i < commands.length; i++) {
							list.unshift(React.createElement(ListItem, { command: commands[i] }));
						}
						return list;
					}([], this)
				)
			),
			React.createElement(
				'div',
				{ className: 'prompt-right prompt' },
				React.createElement(
					'ul',
					null,
					function (list, context) {
						var commands = context.state.commands;
						for (var i = 0; i < commands.length; i++) {
							list.unshift(React.createElement(ListItem, { command: commands[i] }));
						}
						return list;
					}([], this)
				)
			)
		);
	}
});

var Modal = React.createClass({
	displayName: 'Modal',

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'modal' },
			'INFO'
		);
	}
});

var ListItem = React.createClass({
	displayName: 'ListItem',

	render: function render() {
		return React.createElement(
			'li',
			null,
			this.props.command
		);
	}
});

var App = React.createClass({
	displayName: 'App',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(Header, null),
			React.createElement(CommandPrompt, null),
			React.createElement(Modal, null)
		);
	}
});

React.render(React.createElement(App, null), document.getElementById('main'));