var admin = require('firebase-admin');

var serviceAccount = require('./secret/serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://koobot.firebaseio.com'
});

let db = admin.firestore();

let firebase = {};

firebase.getLadder = async () => {
	let ladder = [];

	const playersCollectionRef = db.collection('players').orderBy('position', 'asc');
	await playersCollectionRef.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				ladder.push({...doc.data(), name: doc.id});
			});
		})
		.catch(e => {
			console.log('Error fetching documents', e);
		});

	return ladder;
}

firebase.getPlayerStats = async playerName => {
	let player = {};

	const playerRef = db.collection('players').doc(playerName);
	await playerRef.get()
		.then(doc => {
			if (!doc.exists) {
				player.exists = false;
			} else {
				player = {...doc.data(), exists: true};
			}
		})
		.catch(e => {
			console.log('Error fetching document', e);
		})

	return player;
};

firebase.registerPlayer = async (playerName, playerUniqueId) => {
	let player = {
		position: -1,
		id: playerUniqueId,
		vacation: false,
	}

	db.collection('players').doc(playerName).set(player);
};

firebase.getAllMatches = async () => {
	let matches = [];

	const matchesCollectionRef = db.collection('matches').orderBy('generated', 'desc');
	await matchesCollectionRef.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				matches.push(doc.data());
			});
		})
		.catch(e => {
			console.log('Error fetching documents', e);
		});

	return matches;
};

firebase.writeFixtures = async (fixtures) => {
	for (let fixture of fixtures) {
		db.collection('matches').doc().set({
			attacker: fixture[0],
			defender: fixture[1],
			played: false,
			generated: Date.now(),
		});
	}
}

firebase.getUnplayedMatches = async () => {
	let matches = [];

	const matchesCollectionRef = db.collection('matches')
		.where('played', '==', false)
		.orderBy('generated', 'desc');
	await matchesCollectionRef.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				matches.push(doc.data());
			});
		})
		.catch(e => {
			console.log('Error fetching documents', e);
		});

	return matches;
}

firebase.reportMatch = async (attacker, defender, winner, confirmer) => {
	let writeSuccess = true;

	let matches = [];
	const matchesCollectionRef = db.collection('matches')
		.where('played', '==', false)
		.where('attacker', '==', attacker)
		.where('defender', '==', defender);

	await matchesCollectionRef.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				matches.push({...doc.data(), id: doc.id});
			});
		})
		.catch(e => {
			console.log('Error fetching documents', e);
			writeSuccess = false;
		});

	if (matches.length !== 1) {
		return false;
	}

	await db.collection('matches').doc(matches[0].id).set({
		played: true,
		winner: winner,
		confirmer: confirmer,
		confirmed: false,
	}, {merge: true})
	.catch(e => {
		console.log('Error writing document', e);
		writeSuccess = false;
	});
	return writeSuccess;
};

firebase.confirmMatch = async (confirmer) => {
	let writeSuccess = true;

	let matches = [];
	const matchesCollectionRef = db.collection('matches')
		.where('played', '==', true)
		.where('confirmed', '==', false)
		.where('confirmer', '==', confirmer);

	await matchesCollectionRef.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				matches.push({...doc.data(), id: doc.id});
			});
		})
		.catch(e => {
			console.log('Error fetching documents', e);
			writeSuccess = false;
		});

	if (matches.length !== 1) {
		return false;
	}

	await db.collection('matches').doc(matches[0].id).set({
		confirmed: true,
	}, {merge: true})
	.catch(e => {
		console.log('Error writing document', e);
		writeSuccess = false;
	});

	await firebase.updateStandings(matches[0]);

	return writeSuccess;
}

firebase.updateStandings = async (match) => {
	const attackerStats = await firebase.getPlayerStats(match.attacker);
	const defenderStats = await firebase.getPlayerStats(match.defender);

	let players = await firebase.getLadder();

	if (attackerStats.position !== -1) {
		if (match.winner === match.attacker) {

			// move defender to one above attacker down 1
			for (let player of players) {
				if (player.position >= defenderStats.position && player.position < attackerStats.position) {
					await db.collection('players').doc(player.name).set({
						position: player.position + 1,
					}, {merge: true});
				}
			}

			await db.collection('players').doc(match.attacker).set({
				position: defenderStats.position,
			}, {merge: true});
		}
	} else {
		// If we're placing someone, make a gap below defender
		for (let player of players) {
			if (player.position > defenderStats.position) {
				await db.collection('players').doc(player.name).set({
					position: player.position + 1,
				}, {merge: true});
			}
		}

		if (match.winner === match.attacker) {
			await db.collection('players').doc(match.attacker).set({
				position: defenderStats.position,
			}, {merge: true});

			await db.collection('players').doc(match.defender).set({
				position: defenderStats.position + 1,
			}, {merge: true});
		} else {
			await db.collection('players').doc(match.attacker).set({
				position: defenderStats.position + 1,
			}, {merge: true});
		}
	}
};

firebase.removePlayer = async playerName => {
	const playerStats = await firebase.getPlayerStats(playerName);
	db.collection('players').doc('playername').delete()
		.catch(e => console.log('Error removing document: ', e));

	const players = await firebase.getLadder();
	for (let player of players) {
		if (player.position > playerStats.position) {
			await db.collection('players').doc(player.name).set({
				position: player.position + 1,
			}, {merge: true});
		}
	}
}

firebase.getPlayerNameById = async id => {
	let playerName = '';
	const playersCollectionRef = db.collection('players')
		.where('id', '==', id);

	await playersCollectionRef.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				playerName = doc.id;
			});
		})
		.catch(e => {
			console.log('Error fetching documents', e);
		});
	return playerName;
}

module.exports = firebase;
