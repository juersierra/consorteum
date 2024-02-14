import { auth, db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { periodStore } from './period.store';
import type Period from '$lib/components/navigation/Period.svelte';

export interface Building {
	id?: string;
	name: string;
	address: string;
	periods: Period[];
}
interface Store {
	loading: boolean;
	data: Building | null;
	periods: [];
}

const store = () => {
	const { subscribe, update, set } = writable<Store>({
		loading: true,
		data: null,
		periods: []
	});

	const buildingHandler = {
		getBuilding: async (building_id: string) => {
			update((val) => {
				return { ...val, loading: true };
			});
			const buildDoc = doc(db, 'user', auth.currentUser?.uid, 'buildings', building_id);
			const periodsRef = collection(
				db,
				'user',
				auth.currentUser?.uid,
				'buildings',
				building_id,
				'periods'
			);
			const periods = await getDocs(
				query(periodsRef, orderBy('year', 'desc'), orderBy('month', 'desc'))
			);
			const building = await getDoc(buildDoc);
			update((val) => {
				val.data = { ...building.data(), id: building.id };
				val.periods = [];
				periods.forEach((period) => {
					val.periods[val.periods.length] = { ...period.data(), id: period.id };
				});
				periodStore.periodHandler.getPeriod(building_id, val.periods[0].id, true);
				return { ...val, loading: false };
			});
		}
	};
	return { buildingHandler, subscribe, set, update };
};

export const buildingStore = store();
