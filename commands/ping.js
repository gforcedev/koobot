const BaseCommand = require('./baseCommand.js');

module.exports = class PingCommand extends BaseCommand {
	constructor() {
		super('Ping', {
			description: 'This bot can play pingpong all day long',
			args: {
				phrase: 'Will be repeated back.'
			}
		});
	}

	execute(message, args) {
		if (args[0]) {
			message.channel.send(`Pong ${args[0]}`);
		} else {
			message.channel.send('Pong');
		}
	}
}
