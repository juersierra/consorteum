import { auth, db } from '$lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

export interface Building {
	id?: string;
	name: string;
	address: string;
}
interface Store {
	loading: boolean;
	data: Building | null;
}

const store = () => {
	const { subscribe, update, set } = writable<Store>({
		loading: true,
		data: null
	});

	const buildingHandler = {
		getBuilding: async (building_id: string) => {
			const buildDoc = doc(db, 'user', auth.currentUser?.uid, 'buildings', building_id);
			const building = await getDoc(buildDoc);
			update((val) => {
				val.data = { ...building.data(), id: building.id };
				return { ...val, loading: false };
			});
		}
	};
	return { buildingHandler, subscribe, set, update };
};

export const buildingStore = store();
