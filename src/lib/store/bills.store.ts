import { auth, db } from '$lib/firebase/firebase';
import { collection, doc, getDocs, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

export interface Bill {
	id?: string;
	vendor: string;
	description?: string;
	amount: number;
	is_percentage: boolean;
}

interface Store {
	loading: boolean;
	total_percentage: number;
	total_even: number;
	data: Bill[];
}
const store = () => {
	const { subscribe, update, set } = writable<Store>({
		loading: true,
		total_percentage: 0,
		total_even: 0,
		data: []
	});

	const billsHandler = {
		getBills: async (building_id: string, period_id: string) => {
			update((val: Store) => {
				return { ...val, loading: true };
			});
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildingsColl = collection(userDoc, 'buildings');
			const buildingDoc = doc(buildingsColl, building_id);
			const periodsColl = collection(buildingDoc, 'periods');
			const periodDoc = doc(periodsColl, period_id);
			const billsColl = collection(periodDoc,'bills');
			const bills = await getDocs(billsColl);
			update((val: Store) => {
				val.data = [];
				(val.total_percentage = 0),
					(val.total_even = 0),
					bills.forEach((bill) => {
						val.data[val.data.length] = { id: bill.id, ...bill.data() };
						val.data[val.data.length - 1].is_percentage
							? (val.total_percentage += val.data[val.data.length - 1].amount)
							: (val.total_even += val.data[val.data.length - 1].amount);
					});
				return { ...val, loading: false };
			});
		},
		addBill: async (building_id: string, period_id: string, bill: Bill) => {
			update((val) => {
				return { ...val, loading: true };
			});
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildingsColl = collection(userDoc, 'buildings');
			const buildingDoc = doc(buildingsColl, building_id);
			const periodsColl = collection(buildingDoc, 'periods');
			const periodDoc = doc(periodsColl, period_id);
			const billsColl = collection(periodDoc,'bills');
			addDoc(billsColl,bill);
			billsHandler.getBills(building_id, period_id);
		},
		editBill: async (building_id: string, period_id: string, bill_id: string, bill: Bill) => {
			update((val) => {
				return { ...val, loading: true };
			});
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildingsColl = collection(userDoc, 'buildings');
			const buildingDoc = doc(buildingsColl, building_id);
			const periodsColl = collection(buildingDoc, 'periods');
			const periodDoc = doc(periodsColl, period_id);
			const billsColl = collection(periodDoc,'bills');
			const billDoc = doc(billsColl, bill_id);
			await setDoc(billDoc, bill);
			billsHandler.getBills(building_id, period_id);
		},
		deleteBill: async (building_id: string, period_id: string, bill_id: string) => {
			update((val) => {
				return { ...val, loading: true };
			});
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildingsColl = collection(userDoc, 'buildings');
			const buildingDoc = doc(buildingsColl, building_id);
			const periodsColl = collection(buildingDoc, 'periods');
			const periodDoc = doc(periodsColl, period_id);
			const billsColl = collection(periodDoc,'bills');
			const billDoc = doc(billsColl, bill_id);
			await deleteDoc(billDoc);
			billsHandler.getBills(building_id, period_id);
		}
	};
	return { billsHandler, subscribe, set, update };
};

export const billsStore = store();
