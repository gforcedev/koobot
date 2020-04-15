const PingCommand = require('./ping.js');
const StandingsCommand = require('./standings');

module.exports = {
	ping: new PingCommand(),
	standings: new StandingsCommand(),
};

