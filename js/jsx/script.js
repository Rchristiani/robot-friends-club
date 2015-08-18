'use strict'
var url = window.location.hostname;
var socket = io(`http://${url}:4557`);

var Header = React.createClass({
	getInitialState: function() {
		return {
			connected: 0
		}
	},
	componentDidMount: function() {
		socket.on('connectedUser', (data) => {
			this.setState({
				connected: data
			});
		});
	},
	render: function() {
		return(
			<header>
				<div className="logo-container">
					<img src="robot.svg" />
					<h1>Robot Friends Club</h1>
				</div>
				<span>Connected users: {this.state.connected}</span>
			</header>
		);
	}
});

var CommandPrompt = React.createClass({
	getInitialState: function() {
		return {
			command: '',
			commands: [],
			userCommands: []
		};
	},
	componentDidMount: function() {
		socket.on('robot:direction', (data) => {
			let commands = this.state.commands;
			commands.push(data);
			this.setState({
				commands: commands
			});
		});
	},
	enterCommand: function(e) {
		e.preventDefault();	
		socket.emit('direction', {direction: this.state.command});
		var userCommands = this.state.userCommands;
		userCommands.push(`$~friend: ${this.state.command}`);
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
			<section className="prompt-container">
				<div className="prompt-left prompt">
					<div className="prompt-line">
						<span className="prompt-icon"> $~friend:</span>
							<form onSubmit={this.enterCommand}> 
								<input type="text" value={this.state.command} onChange={this.onChange}/>
							</form>
					</div>
					<ul>
					{(function(list,context) {
						var commands = context.state.userCommands;
						for(let i = 0; i < commands.length; i++) {
							list.unshift(<ListItem command={commands[i]} />);
						}
						return list;
					})([],this)}
					</ul>
				</div>
				<div className="prompt-right prompt">
					<ul>{(function(list,context) {
							var commands = context.state.commands;
							for(let i = 0; i < commands.length; i++) {
								list.unshift(<ListItem command={commands[i]} />);
							}
							return list;
						})([], this)}
					</ul>
				</div>
			</section>
		);
	}
});

var ListItem = React.createClass({
	render: function() {
		return <li>{this.props.command}</li>
	}
});

var App = React.createClass({
	render: function() {
		return (
			<div>
				<Header />
				<CommandPrompt />
			</div>
		);
	}	
});

React.render(<App/>, document.getElementById('main'));