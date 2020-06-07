const PingCommand = require('./ping.js');
const RegisterCommand = require('./register')
const StandingsCommand = require('./standings');
const StatsCommand = require('./stats')
const GenerateCommand = require('./generate');
const ViewfixturesCommand = require('./viewfixtures.js');
const ReportCommand = require('./report.js')

module.exports = {
	ping: new PingCommand(),
	register: new RegisterCommand(),
	standings: new StandingsCommand(),
	stats: new StatsCommand(),
	generate: new GenerateCommand(),
	viewfixtures: new ViewfixturesCommand(),
	report: new ReportCommand(),
};

