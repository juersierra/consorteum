import { auth, db } from '$lib/firebase/firebase';
import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

export interface Resident {
	id?: string;
	name: string;
	position: string;
	percentage: { house: number; park: number };
}
interface Store {
	loading: boolean;
	data: Resident[];
	total_perc: number;
}

const store = () => {
	const { subscribe, update, set } = writable<Store>({
		loading: true,
		data: [],
		total_perc: 0
	});

	const residentsHandler = {
		getResidents: async (building_id: string) => {
			update((val: Store) => {
				return { ...val, loading: true };
			});
			const residentColl = collection(
				db,
				'user',
				auth.currentUser?.uid,
				'buildings',
				building_id,
				'residents'
			);
			const residents = await getDocs(residentColl);
			update((val: Store) => {
				val.data = [];
				residents.forEach((resident) => {
					val.data[val.data.length] = { ...resident.data(), id: resident.id };
				});
				val.total_perc = 0;
				val.data.reduce(
					(acc, curr) =>
						acc +
						(curr.percentage?.house ? curr.percentage.house : 0) +
						(curr.percentage?.park ? curr.percentage.park : 0),
					0
				);
				return { ...val, loading: false };
			});
		},
		addResident: async (building_id: string, resident: Resident) => {
			const residentColl = collection(
				db,
				'user',
				auth.currentUser?.uid,
				'buildings',
				building_id,
				'residents'
			);
			await addDoc(residentColl, resident);
			residentsHandler.getResidents(building_id);
			return;
		},
		editResident: async (building_id: string, resident_id: string, resident: Resident) => {
			const residentDoc = doc(
				db,
				'user',
				auth.currentUser?.uid,
				'buildings',
				building_id,
				'residents',
				resident_id
			);
			await setDoc(residentDoc, resident);
			residentsHandler.getResidents(building_id);
			return;
		}
	};
	return { residentsHandler, subscribe, set, update };
};

export const residentsStore = store();
