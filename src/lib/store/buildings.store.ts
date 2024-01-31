import { auth, db } from '$lib/firebase/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { writable } from 'svelte/store';

export interface Building {
	id?: string;
	name: string;
	address: string;
}
interface Store {
	loading: boolean;
	data: Building[];
}

const store = () => {
	const { subscribe, update, set } = writable<Store>({
		loading: true,
		data: []
	});

	const buildingsHandler = {
		getBuildings: async () => {
			console.log('gettin bs store');

			const buildColl = collection(db, 'user', auth.currentUser?.uid, 'buildings');
			const buildings = await getDocs(buildColl);
			update((val: Store) => {
				console.log('updating');
				val.data = [];
				buildings.forEach((building) => {
					val.data[val.data.length] = { ...building.data(), id: building.id };
				});
				return { ...val, loading: false };
			});
		},

		createBuilding: async (building: Building) => {
			const buildRef = await addDoc(
				collection(db, 'user', auth.currentUser?.uid, 'buildings'),
				building
			);
			console.log('edificio creado', buildRef);
			buildingsHandler.getBuildings();
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
	return { buildingsHandler, subscribe, set, update };
};

export const buildingsStore = store();
