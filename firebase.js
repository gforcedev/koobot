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

	const matchesCollectionRef = db.collection('matches').orderBy('generatedOn', 'desc');
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

module.exports = firebase;
