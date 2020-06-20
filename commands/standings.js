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
		// message.channel.send('The ladder is not yet viewable - come back soon to see when it gets created, and register if you would like to be involved!');
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
