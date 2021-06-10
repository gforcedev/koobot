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
		const players = await firebase.getLadder();

		const fixtureEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('King of Ones Fixtures')

		let fixtureString = '';
		for (let fixture of fixtures) {
			fixtureString += `**(${this.getPlayerPos(players, fixture.attacker)})** ${fixture.attacker.toUpperCase()} _attacking_ **(${this.getPlayerPos(players, fixture.defender)})** ${fixture.defender.toUpperCase()}\n\n`;
		}
		fixtureEmbed.setDescription(fixtureString);

		message.channel.send(fixtureEmbed);
	}

	getPlayerPos(players, name) {
		const pos = players.filter(p => p.name === name)[0].position;

		if (pos === -1) return 'New';
		return pos.toString();
	}
}
