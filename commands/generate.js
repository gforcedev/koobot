const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');
const fixturegen = require('../fixturegen.js');

module.exports = class GenerateCommand extends BaseCommand {
	constructor() {
		super('Generate', {
			description: 'Generate a round of fixtures, if you have the permissions',
			args: {}
		});
	}

	async execute(message, args) {
		if (message.member.id === '169831418656980992') { // that's me
			await firebase.deleteUnplayed();
			const fixtures = await fixturegen.generateFixtures();
			firebase.writeFixtures(fixtures);
			message.channel.send(`A round of fixtures has been generated. Use the viewfixtures command to see them.`);
		} else {
			message.channel.send(`Sorry ${message.member.displayName}, looks like you don't have permissions to run that command.`);
		}
	}
}
