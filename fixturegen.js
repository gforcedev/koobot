const firebase = require('./firebase.js');

let fixturegen = {}

// gen the fixtures format array of arrays of 2 players each, identified by nickname
fixturegen.generateFixtures = async () => {
	const matchList = await firebase.getAllMatches();
	const playerList = await firebase.getLadder();

	let playersToMatch = playerList.filter(e => !e.vacation);

	// If we have an odd number of players, just pick a random one to remove
	if (playersToMatch.length % 2 !== 0) {
		const i = Math.floor(Math.random() * playersToMatch.length);
		playersToMatch.splice(i, 1);
	}

	// Generate a random set of fixtures
	let bestFixtures = [];

	while (playersToMatch.length > 0) {
		let fixture = [];
		for (let i = 0; i < 2; i++) {
			let player = Math.floor(Math.random() * playersToMatch.length);
			fixture.push(playersToMatch[player].name);
			playersToMatch.splice(player, 1);
		}
		bestFixtures.push(fixture);
	}

	let bestScore = _scoreFixtures(bestFixtures, playerList, matchList);
	let swapCount = 0;

	while (swapCount < 5000) {
		const newFixtures = _swapTwoInFixtureList(bestFixtures);
		const newScore = _scoreFixtures(newFixtures, playerList, matchList);
		if (newScore < bestScore) {
			bestScore = newScore;
			bestFixtures = JSON.parse(JSON.stringify(newFixtures));
			swapCount = 0;
		} else {
			swapCount++;
		}
	}

	return _setAttackDefence(bestFixtures, playerList);
}

_scoreFixtures = (fixtureList, playerList, matchList) => {
	const players = {};
	for (let player of playerList) {
		players[player.name] = player;
		// If it's someone new, use their seed for fixture generation
		if (player.position === -1) {
			players[player.name].checkPosition = player.position; // for new vs new check
			players[player.name].position = player.seed;
		}
	}


	let score = BigInt(0);
	for (let fixture of fixtureList) {
		// Add the temp^(difference in positions to the score)
		// So fixtures that are really far apart are exponentially less incentivised
		const temp = 1.8;
		score += BigInt(Math.floor(temp ** Math.abs((players[fixture[0]].position - players[fixture[1]].position))));

		// If the players have played each other recently, increase the score
		const player1Matches = _getPlayerMatches(fixture[0], matchList)
			.slice(0, 4);
		for (let i = 0; i < player1Matches.length; i++) {
			if (player1Matches[i].attacker === fixture[1] ||
				player1Matches[i].defender === fixture[1]) {
				score += BigInt(Math.floor(temp ** (4 - i)));
			}
		}

		// If one of the players wants to play the other, decrease the score
		if (players[fixture[0]].challenging == fixture[1]) {
			score -= BigInt(Math.floor(temp ** 3));
		}
		if (players[fixture[1]].challenging == fixture[0]) {
			score -= BigInt(Math.floor(temp ** 3));
		}

		// If both of the players are new, we REALLY don't want this to happen
		if (players[fixture[0]].checkPosition === -1 && players[fixture[1]].checkPosition === -1) {
			return Infinity;
		}
	}

	return score;
}

_swapTwoInFixtureList = (fixtureList) => {
	let newFixtureList = JSON.parse(JSON.stringify(fixtureList));
	const match1 = Math.floor(Math.random() * fixtureList.length);
	const player1 = Math.floor(Math.random() * 2);
	const name1 = fixtureList[match1][player1];

	const match2 = Math.floor(Math.random() * fixtureList.length);
	const player2 = Math.floor(Math.random() * 2);
	const name2 = fixtureList[match2][player2];

	newFixtureList[match1][player1] = name2;
	newFixtureList[match2][player2] = name1;

	return newFixtureList;
};

_getPlayerMatches = (player, matchList) => {
	return matchList
		.filter(e => e.attacker === player | e.defender === player)
		.sort((a, b) => {b.generated - a.generated}); // NEWEST first
};

_setAttackDefence = (fixtures, playerList) => {
	let newFixtures = fixtures.slice();
	const players = {};
	for (let player of playerList) {
		players[player.name] = player;
	}

	for (let i = 0; i < fixtures.length; i++) {
		// checkPosition is -1 if the player is new
		if (
			(players[fixtures[i][0]].position < players[fixtures[i][1]].position &&
				players[fixtures[i][0]].checkPosition !== -1) ||
			(players[fixtures[i][1]].checkPosition === -1)
		)
		{
			temp = newFixtures[i][0];
			newFixtures[i][0] = fixtures[i][1];
			newFixtures[i][1] = temp;
		}
	}

	return newFixtures;
}

module.exports = fixturegen;
