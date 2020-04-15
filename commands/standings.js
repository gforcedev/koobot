const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class StandingsCommand extends BaseCommand {
	constructor() {
		super('Standings', {
			description: 'Get the current standings',
			args: {}
		});
	}

	async execute(message, args) {
		const ladder = await firebase.getLadder();

		let ladderString = '';
		for (let i = 1; i < ladder.length; i++) {
			ladderString += `${i}. ${ladder[i].name}\n`;
		}

		// remove trailing newline
		ladderString.slice(0, -1);

		const ladderEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('King of Ones Standings')
			.setDescription(`All hail our ruler: ${ladder[0].name.toUpperCase()}`)
			.addField('The challengers', ladderString);

		message.channel.send(ladderEmbed);
	}
}
