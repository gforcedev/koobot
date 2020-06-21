const Discord = require('discord.js');

const BaseCommand = require('./baseCommand.js');
const firebase = require('../firebase.js');

module.exports = class RemoveCommand extends BaseCommand {
	constructor() {
		super('Remove', {
			description: 'Remove a player from the ladder, if you have the permissions',
			args: {
				player: '@mention the player to remove',
			}
		});
	}

	async execute(message, args) {
		if (message.member.id === '169831418656980992') { // that's me
			const playerName = await firebase.getPlayerNameById(args[0].match(/[0-9]+/g)[0]);
			await firebase.removePlayer(playerName);
			message.channel.send(`${playerName.toUpperCase()} successfully removed from King of ones.`);
		} else {
			message.channel.send(`Sorry ${message.member.displayName}, looks like you don't have permissions to run that command.`);
		}
	}
}
