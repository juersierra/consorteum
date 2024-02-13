import { billsStore } from './bills.store';
import { auth, db } from '$lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

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
			const periodRef = doc(
				db,
				'user',
				auth.currentUser?.uid,
				'buildings',
				building_id,
				'periods',
				period_id
			);
			const period = await getDoc(periodRef);
			update((val: Store) => {
				if ((val.data == undefined && reload) || !reload) {
					val.data = { ...period.data(), id: period.id };
				}
				billsStore.billsHandler.getBills(building_id, period_id);
				return { ...val, loading: false };
			});
		}
	};

	return { periodHandler, subscribe, set, update };
};

export const periodStore = store();
