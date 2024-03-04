import { billsStore } from './bills.store';
import { auth, db } from '$lib/firebase/firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { buildingStore } from './building.store';

export interface Period {
	id?: string;
	month: number;
	year: number;
}

interface Store {
	loading: boolean;
	data: Period | null;
}

const store = () => {
	const { subscribe, update, set } = writable<Store>({
		loading: true,
		data: null
	});

	const periodHandler = {
		getPeriod: async (building_id: string, period_id: string, reload = false) => {
			update((val: Store) => {
				return { ...val, loading: true };
			});
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildingsColl = collection(userDoc, 'buildings');
			const buildingDoc = doc(buildingsColl, building_id);
			const periodsColl = collection(buildingDoc, 'periods');
			const periodDoc = doc(periodsColl, period_id);
			const period = await getDoc(periodDoc);
			update((val: Store) => {
				if ((val.data == undefined && reload) || !reload) {
					val.data = { ...period.data(), id: period.id };
					billsStore.billsHandler.getBills(building_id, period_id);
				}
				return { ...val, loading: false };
			});
		},
		createPeriod: async (building_id: string, period: Period) => {
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildingsColl = collection(userDoc, 'buildings');
			const buildingDoc = doc(buildingsColl, building_id);
			const periodsColl = collection(buildingDoc, 'periods');
			const periodRef = await addDoc( periodsColl, period
			);
			buildingStore.buildingHandler.getBuilding(building_id);
			periodHandler.getPeriod(building_id, periodRef.id);
		}
	};

	return { periodHandler, subscribe, set, update };
};

export const periodStore = store();
