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

module.exports = firebase;
