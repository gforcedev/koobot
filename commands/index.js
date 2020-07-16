const PingCommand = require('./ping.js');
const RegisterCommand = require('./register')
const StandingsCommand = require('./standings');
const StatsCommand = require('./stats')
const GenerateCommand = require('./generate');
const ViewfixturesCommand = require('./viewfixtures.js');
const ReportCommand = require('./report.js')
const ConfirmCommand = require('./confirm.js');
const RemoveCommand = require('./remove.js');
const ChallengeCommand = require('./challenge');

module.exports = {
	ping: new PingCommand(),
	register: new RegisterCommand(),
	standings: new StandingsCommand(),
	stats: new StatsCommand(),
	generate: new GenerateCommand(),
	viewfixtures: new ViewfixturesCommand(),
	report: new ReportCommand(),
	confirm: new ConfirmCommand(),
	remove: new RemoveCommand(),
	challenge: new ChallengeCommand(),
};

