const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class RegisterCommand extends BaseCommand {
	constructor() {
		super('Register', {
			description: 'Get in on the king of ones action',
			args: {}
		});
	}

	async execute(message, args) {
		let player = await firebase.getPlayerStats(message.member.displayName.toLowerCase());
		if (!player.exists) {
			firebase.registerPlayer(message.member.displayName.toLowerCase(), message.member.id);

			message.channel.send(`${message.member.displayName}, you've been successfully registered for King of Ones. Good Luck.`);
		} else {
			message.channel.send(`Sorry ${message.member.displayName}, looks like you're already registered. Please contact an admin if you think this is a mistake`);
		}
	}
}
