const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class UnchallengeCommand extends BaseCommand {
	constructor() {
		super('Unchallenge', {
			description: 'Set challenging nobody',
			args: {}
		});
	}

	async execute(message, args) {
		const challengerName = await firebase.getPlayerNameById(message.member.id);
		firebase.unsetPlayerChallenging(challengerName);

		message.channel.send(`${challengerName}, you're no longer challenging anyone.`);
	}
}
