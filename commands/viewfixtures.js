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

		let attackerString = '';
		let vsString = '';
		let defenderString = '';
		for (let fixture of fixtures) {
			attackerString += `**(${this.getPlayerPos(players, fixture.attacker)})** ${fixture.attacker.toUpperCase()}\n`;
			vsString += 'vs\n';
			defenderString += `**(${this.getPlayerPos(players, fixture.defender)})** ${fixture.defender.toUpperCase()}\n`;
		}


		fixtureEmbed.addFields(
			{ name: 'Attacker', value: attackerString, inline: true },
			{ name: '-', value: vsString, inline: true },
			{ name: 'Defender', value: defenderString, inline: true },
		);

		message.channel.send(fixtureEmbed);
	}

	getPlayerPos(players, name) {
		let pos;
		try {
			pos = players.filter(p => p.name === name)[0].position;
		} catch (e) {
			return "X";
		}

		if (pos === -1) return 'New';
		if (pos === 0) return ':crown:';
		return pos.toString();
	}
}
