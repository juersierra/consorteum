import { auth, db } from '$lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

export interface Bill {
	vendor: string;
	description?: string;
	amount: number;
	is_monthly: boolean;
	is_percentage: boolean;
}

export interface Period {
	id?: string;
	month: number;
	year: number;
	bills: Bill[];
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
			update((val) => {
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
			update((val) => {
				if ((val.data == undefined && reload) || !reload) {
					val.data = { ...period.data(), id: period.id };
				}
				return { ...val, loading: false };
			});
		}
	};
	const billHandler = {
		addBill: async (building_id: string, period_id: string, bill: Bill) => {
			update((val) => {
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
			update((val) => {
				val.data = { ...period.data() };
				val.data?.bills.push(bill);
				return { ...val, loading: false };
			});
		},
		editBill: async (building_id: string, period_id: string, bill_index: number, bill: Bill) => {
			update((val) => {
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
			update((val) => {
				val.data = { ...period.data() };
				if (val.data) {
					val.data.bills[bill_index] = bill;
				}
				return { ...val, loading: false };
			});
		},
		deleteBill: async (building_id: string, period_id: string, bill_index: number) => {
			update((val) => {
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
			update((val) => {
				val.data = { ...period.data() };
				if (val.data) {
					val.data.bills.splice(bill_index, 1);
				}
				return { ...val, loading: false };
			});
		}
	};
	return { periodHandler, billHandler, subscribe, set, update };
};

export const periodStore = store();
