const Discord = require('discord.js');

module.exports = class baseCommand {
	constructor(name, helpInfo) {
		this._name = name;
		this._helpInfo = helpInfo;
	}

	execute(message, args) {
	}

	getHelpEmbed() {
		let argsText = '';
		for (let arg in this._helpInfo.args) {
			argsText += `\n\`${arg}\`: ${this._helpInfo.args[arg]}`;
		}

		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(this._name)
			.setDescription(`\`${this._name.toLowerCase()}\`: ${this._helpInfo.description}`)

		if (argsText !== '') {
			helpEmbed.addField('Arguments', argsText, true);
		}

		return helpEmbed;
	}
}
