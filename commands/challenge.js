const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class ChallengeCommand extends BaseCommand {
	constructor() {
		super('Challenge', {
			description: 'Set the player you want to challenge',
			args: {
				player: '@ the player you want to be challenging',
			}
		});
	}

	async execute(message, args) {
		const challengerName = await firebase.getPlayerNameById(message.member.id);
		const challengeeName = await firebase.getPlayerNameById(args[0].match(/[0-9]+/g)[0]);

		firebase.setPlayerChallenging(challengerName, challengeeName);

		message.channel.send(`${challengerName}, you are now challenging ${challengeeName}`);
	}
}
