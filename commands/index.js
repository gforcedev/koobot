const PingCommand = require('./ping.js');
const RegisterCommand = require('./register')
const StandingsCommand = require('./standings');
const StatsCommand = require('./stats')
const GenerateCommand = require('./generate');

module.exports = {
	ping: new PingCommand(),
	register: new RegisterCommand(),
	standings: new StandingsCommand(),
	stats: new StatsCommand(),
	generate: new GenerateCommand(),
};

