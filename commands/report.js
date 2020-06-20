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
				winner: 'The player who WON the game'
			}
		});
	}

	async execute(message, args) {
		const attacker = await firebase.getPlayerNameById(args[0].match(/[0-9]+/g)[0]);
		const defender = await firebase.getPlayerNameById(args[1].match(/[0-9]+/g)[0]);
		const winner = await firebase.getPlayerNameById(args[2].match(/[0-9]+/g)[0]);
		const reporterName = await firebase.getPlayerNameById(message.member.id);

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
