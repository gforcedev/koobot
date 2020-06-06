const PingCommand = require('./ping.js');
const RegisterCommand = require('./register')
const StandingsCommand = require('./standings');
const StatsCommand = require('./stats')

module.exports = {
	ping: new PingCommand(),
	register: new RegisterCommand(),
	standings: new StandingsCommand(),
	stats: new StatsCommand(),
};

