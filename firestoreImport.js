import firestoreService from 'firestore-export-import';
// import firebaseConfig from '../src/config/firebase.js';
import serviceAccount from './serviceAccount.json' assert { type: 'json' };
import fs from 'fs';
const tempFileName = `${process.cwd()}/data-temp.json`;

const firebaseConfig = {
	apiKey: 'AIzaSyA1jr1Ng3BCOtDhW2Y_WTDBRuhr-0TeHEU',
	authDomain: 'vue-school-forum-ccab2.firebaseapp.com',
	projectId: 'vue-school-forum-ccab2',
	storageBucket: 'vue-school-forum-ccab2.appspot.com',
	messagingSenderId: '121793707867',
	appId: '1:121793707867:web:4910399cd80994a121247e',
};

// procedure
(async () => {
	const fileContents = fs.readFileSync(
		`${process.cwd()}/src/data.json`,
		'utf8'
	);
	const data = JSON.parse(fileContents);
	const transformed = transformDataForFirestore(data);
	fs.writeFileSync(tempFileName, JSON.stringify(transformed));
	await jsonToFirestore();
	fs.unlinkSync(tempFileName);
})();

// Helper Functions
// -------------------------------------

// JSON To Firestore
async function jsonToFirestore() {
	try {
		console.log('Initialzing Firebase');
		await firestoreService.initializeApp(
			serviceAccount,
			firebaseConfig.databaseURL
		);
		console.log('Firebase Initialized');

		await firestoreService.restore(tempFileName);
		console.log('Upload Success');
	} catch (error) {
		console.log(error);
	}
}

// In order to preserve ids in data.json
// as ids in firestore
// must use keyed object (id being the key) instead of array of records
function transformDataForFirestore(data) {
	const collections = data;
	delete collections.stats;
	const collectionsById = {};
	Object.keys(collections).forEach(collectionKey => {
		collectionsById[collectionKey] = {};
		const collection = collections[collectionKey];
		collection.forEach(record => {
			collectionsById[collectionKey][record.id] = record;
			delete collectionsById[collectionKey][record.id].id;
		});
	});
	return collectionsById;
}
