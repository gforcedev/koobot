const PingCommand = require('./ping.js');
const RegisterCommand = require('./register')
const StandingsCommand = require('./standings');
const StatsCommand = require('./stats')
const GenerateCommand = require('./generate');
const ViewfixturesCommand = require('./viewfixtures.js');
const MobileFixturesCommand = require('./mobilefixtures.js');
const ReportCommand = require('./report.js')
const ConfirmCommand = require('./confirm.js');
const RemoveCommand = require('./remove.js');
const ChallengeCommand = require('./challenge');
const UnchallengeCommand = require('./unchallenge');

module.exports = {
	ping: new PingCommand(),
	register: new RegisterCommand(),
	standings: new StandingsCommand(),
	stats: new StatsCommand(),
	generate: new GenerateCommand(),
	viewfixtures: new ViewfixturesCommand(),
	mobilefixtures: new MobileFixturesCommand(),
	report: new ReportCommand(),
	confirm: new ConfirmCommand(),
	remove: new RemoveCommand(),
	challenge: new ChallengeCommand(),
	unchallenge: new UnchallengeCommand(),
};

