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
	const players = await playersCollectionRef.get()
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
	let getPlayer = await playerRef.get()
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

module.exports = firebase;
