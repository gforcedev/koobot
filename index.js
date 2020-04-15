const Discord = require('discord.js');

const config = require('./config.json');
const commands = require('./commands');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Client is ready');
})

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;


	const args = message.content.slice(config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (commandName === 'help') {
		try {
			message.channel.send(commands[args[0]].getHelpEmbed());
		} catch(e) {
			message.channel.send('Help not found. Sorry!');
			console.log(e);
		}
		return;
	}

	try {
		commands[commandName].execute(message, args)
	} catch(e) {
		message.channel.send('Oops, something broke!');
		console.log(e);
	}
});

client.login(config.token);
