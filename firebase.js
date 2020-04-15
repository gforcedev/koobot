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

module.exports = firebase;
