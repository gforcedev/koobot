const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class ViewfixturesCommand extends BaseCommand {
	constructor() {
		super('Viewfixtures', {
			description: 'View all of the current unplayed fixtures',
			args: {}
		});
	}

	async execute(message, args) {
		const fixtures = await firebase.getUnplayedMatches();

		const fixtureEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('King of Ones Fixtures')

		for (let fixture of fixtures) {
			fixtureEmbed.addField('Attacker', fixture.attacker, true);
			fixtureEmbed.addField('---', 'vs', true);
			fixtureEmbed.addField('Defender', fixture.defender, true);
		}

		message.channel.send(fixtureEmbed);
	}
}
