const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class ConfirmCommand extends BaseCommand {
	constructor() {
		super('Confirm', {
			description: 'Confirm the result of a reported fixture',
			args: {
			}
		});
	}

	async execute(message, args) {
		const confirmer = message.member.displayName.toLowerCase();

		const confirmStatus = await firebase.confirmMatch(confirmer);
		if (confirmStatus) {
			message.channel.send('The match was confirmed successfully');
		} else {
			message.channel.send('There was an error confirming the match.');
		}
	}
}
