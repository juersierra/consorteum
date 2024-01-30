import { auth, db } from '$lib/firebase/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';
import { writable } from 'svelte/store';

const store = () => {
	const { subscribe, update, set } = writable({
		loading: true,
		data: []
	});

	const buildingHandler = {
		getBuildings: async () => {
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildings = await getDocs(collection(userDoc, 'buildings'));

			update((val) => {
				buildings.forEach((building) => {
					val.data[val.data.length] = building.data();
				});
				val.loading = false;
				return val;
			});
		}
		// 	if (!auth.currentUser) throw new Error('Usuario no logueado');

		// 	const userColl = collection(db, 'user');

		// 	const userDoc = doc(userColl, auth.currentUser.uid);
		// 	update((val) => {
		// 		val.data = collection(userDoc, 'building');
		// 		console.log(val.data);
		// 	});
		// };
		// login: async (email: string, pass: string) => {
		// 	await signInWithEmailAndPassword(auth, email, pass);
		// },
		// logout: async () => {
		// 	await signOut(auth);
		// }
	};
	return { buildingHandler, subscribe, set, update };
};

export const buildingStore = store();
