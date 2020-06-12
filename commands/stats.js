const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class StatsCommand extends BaseCommand {
	constructor() {
		super('Stats', {
			description: 'Get stats for a player',
			args: {
				player: 'The player to get the stats for',
			}
		});
	}

	// To return human-readable form of stat in db form
	_processStat(stat, value) {
		if (stat === 'position') {
			if (value === 0) {
				return 'Our Ruler';
			} else {
				return value.toString();
			}
		} else {
			return value.toString();
		}
	}

	async execute(message, args) {
		let player = await firebase.getPlayerStats(args[0]);
		if (!player.exists) {
			message.channel.send('Unable to find that player. Use the standings command to check available players');
			return;
		}

		const statsEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`King of ones stats for ${args[0].toUpperCase()}`)

		const dontShow = ['exists', 'seed', 'id'];

		for (let k of Object.keys(player)) {
			if (dontShow.indexOf(k) === -1) {
				statsEmbed.addField(k, this._processStat(k, player[k]));
			}
		}

		message.channel.send(statsEmbed);
	}
}
