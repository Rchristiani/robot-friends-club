'use strict'
var url = window.location.hostname;
var socket = io(("http://" + url + ":4557"));

var Header = React.createClass({displayName: "Header",
	getInitialState: function() {
		return {
			connected: 0
		}
	},
	componentDidMount: function() {
		socket.on('connectedUser', function(data)  {
			this.setState({
				connected: data
			});
		}.bind(this));
	},
	render: function() {
		return(
			React.createElement("header", null, 
				React.createElement("div", {className: "logo-container"}, 
					React.createElement("img", {src: "robot.svg"}), 
					React.createElement("h1", null, "Robot Friends Club")
				), 
				React.createElement("span", null, "Connected users: ", this.state.connected)
			)
		);
	}
});

var CommandPrompt = React.createClass({displayName: "CommandPrompt",
	getInitialState: function() {
		return {
			command: '',
			commands: [],
			userCommands: []
		};
	},
	componentDidMount: function() {
		socket.on('robot:direction', function(data)  {
			let commands = this.state.commands;
			commands.push(data);
			this.setState({
				commands: commands
			});
		}.bind(this));
	},
	enterCommand: function(e) {
		e.preventDefault();	
		socket.emit('direction', {direction: this.state.command});
		var userCommands = this.state.userCommands;
		userCommands.push(("$~friend: " + this.state.command));
		this.setState({
			command: '',
			userCommands: userCommands
		});
	},
	onChange: function(e) {
		this.setState({
			command: e.target.value.toLowerCase()
		});
	},
	render: function() {
		return (
			React.createElement("section", {className: "prompt-container"}, 
				React.createElement("div", {className: "prompt-left prompt"}, 
					React.createElement("div", {className: "prompt-line"}, 
						React.createElement("span", {className: "prompt-icon"}, " $~friend:"), 
							React.createElement("form", {onSubmit: this.enterCommand}, 
								React.createElement("input", {type: "text", value: this.state.command, onChange: this.onChange})
							)
					), 
					React.createElement("ul", null, 
					(function(list,context) {
						var commands = context.state.userCommands;
						for(let i = 0; i < commands.length; i++) {
							list.unshift(React.createElement(ListItem, {command: commands[i]}));
						}
						return list;
					})([],this)
					)
				), 
				React.createElement("div", {className: "prompt-right prompt"}, 
					React.createElement("ul", null, (function(list,context) {
							var commands = context.state.commands;
							for(let i = 0; i < commands.length; i++) {
								list.unshift(React.createElement(ListItem, {command: commands[i]}));
							}
							return list;
						})([], this)
					)
				)
			)
		);
	}
});

var ListItem = React.createClass({displayName: "ListItem",
	render: function() {
		return React.createElement("li", null, this.props.command)
	}
});

var App = React.createClass({displayName: "App",
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(Header, null), 
				React.createElement(CommandPrompt, null)
			)
		);
	}	
});

React.render(React.createElement(App, null), document.getElementById('main'));