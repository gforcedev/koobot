const Discord = require('discord.js');
const AsciiTable = require('ascii-table');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class MobileFixturesCommand extends BaseCommand {
	constructor() {
		super('Viewfixtures', {
			description: 'View all of the current unplayed fixtures',
			args: {}
		});
	}

	async execute(message, args) {
		const fixtures = await firebase.getUnplayedMatches();
		const players = await firebase.getLadder();

		let table = new AsciiTable;
		table.setHeading('Attacker', '-', 'Defender');

		for (let fixture of fixtures) {
			table.addRow(
				`(${this.getPlayerPos(players, fixture.attacker)}) ${fixture.attacker.toUpperCase()}`,
				'vs',
				`(${this.getPlayerPos(players, fixture.defender)}) ${fixture.defender.toUpperCase()}`,
			);
		}

		message.channel.send(`\`\`\`${table.toString()}\`\`\``);
	}

	getPlayerPos(players, name) {
		let pos;
		try {
			pos = players.filter(p => p.name === name)[0].position;
		} catch (e) {
			return "X";
		}

		if (pos === -1) return 'NEW';
		if (pos === 0) return 'KING';
		return pos.toString();
	}
}
