const PingCommand = require('./ping.js');
const StandingsCommand = require('./standings');
const StatsCommand = require('./stats')

module.exports = {
	ping: new PingCommand(),
	standings: new StandingsCommand(),
	stats: new StatsCommand(),
};

