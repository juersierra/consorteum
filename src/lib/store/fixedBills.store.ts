import { auth, db } from '$lib/firebase/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

export interface FixedBill {
	id?: string;
	description: string;
	vendor: string;
	is_percentage: boolean;
	// amount: string;
	// invoice_number: string;
}

interface Store {
	loading: boolean;
	data: FixedBill[];
}

const store = () => {
	const { subscribe, update, set } = writable<Store>({
		loading: true,
		data: []
	});

	const fixedBillsHandler = {
		getFixedBills: async (building_id: string) => {
			update((val: Store) => {
				return { ...val, loading: true };
			});
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildColl = collection(userDoc, 'buildings');
			const buildDoc = doc(buildColl, building_id);
			const fixedBillsColl = collection(buildDoc,	'fixedBills');
			const fixedBills = await getDocs(fixedBillsColl);
			update((val: Store) => {
				val.data = [];
				fixedBills.forEach((fixedBill) => {
					val.data[val.data.length] = { ...fixedBill.data(), id: fixedBill.id };
				});
				return { ...val, loading: false };
			});
		},
		addFixedBill: async (building_id: string, fixedBill: FixedBill) => {
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildColl = collection(userDoc, 'buildings');
			const buildDoc = doc(buildColl, building_id);
			const fixedBillsColl = collection(buildDoc,	'fixedBills');
			await addDoc(fixedBillsColl, fixedBill);
			fixedBillsHandler.getFixedBills(building_id);
			return;
		},
		editFixedBill: async (
			building_id: string,
			fixedBill_id: string | undefined,
			fixedBill: FixedBill
		) => {
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildColl = collection(userDoc, 'buildings');
			const buildDoc = doc(buildColl, building_id);
			const fixedBillsColl = collection(buildDoc,	'fixedBills');
			const fixedBillDoc = doc(fixedBillsColl,	fixedBill_id);
			await setDoc(fixedBillDoc, fixedBill);
			fixedBillsHandler.getFixedBills(building_id);
			return;
		},
		deleteFixedBill: async (building_id: string, fixedBill_id: string | undefined) => {
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildColl = collection(userDoc, 'buildings');
			const buildDoc = doc(buildColl, building_id);
			const fixedBillsColl = collection(buildDoc,	'fixedBills');
			const fixedBillDoc = doc(fixedBillsColl,	fixedBill_id);
			await deleteDoc(fixedBillDoc);
			fixedBillsHandler.getFixedBills(building_id);
			return;
		}
	};
	return { fixedBillsHandler, subscribe, set, update };
};

export const fixedBillsStore = store();
