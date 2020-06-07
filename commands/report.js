const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class ReportCommand extends BaseCommand {
	constructor() {
		super('Report', {
			description: 'Report the result of a fixture',
			args: {
				attacker: 'The player who was lower on the leaderboard, or the unrated player',
				defender: 'The player who was higher on the leaderboard, or the already existing player',
				winner: 'The player who lost the game'
			}
		});
	}

	async execute(message, args) {
		const attacker = args[0];
		const defender = args[1];
		const winner = args[2];
		const reporterName = message.member.displayName.toLowerCase();
		let confirmer = '';

		if (reporterName === attacker) {
			confirmer = defender;
		} else if (reporterName === defender) {
			confirmer = attacker;
		}

		const reportStatus = await firebase.reportMatch(attacker, defender, winner, confirmer);
		if (reportStatus) {
			message.channel.send('The match was recorded successfully. Your opponent needs to run the confirm command for the leaderboard to be updated.');
		} else {
			message.channel.send('There was an error reporting the match.');
		}
	}
}
