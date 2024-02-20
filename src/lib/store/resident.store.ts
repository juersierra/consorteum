import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { writable } from 'svelte/store';

export interface Resident {
	id?: string;
	name: string;
	position: string;
	percentage: { house: number; park: number };
	account: { concept: string; amount: number }[];
}

interface Store {
	loading: boolean;
	data: Resident | null;
	account: [];
}

const store = () => {
	const { subscribe, update, set } = writable<Store>({
		loading: true,
		data: null,
		account: []
	});

	const residentHandler = {
		getResident: async (building_id: string, resident_id: string) => {
			update((val: Store) => {
				return { ...val, loading: true };
			});
			const userColl = collection(db, 'user');
			const userDoc = doc(userColl, auth.currentUser?.uid);
			const buildingsColl = collection(userDoc, 'buildings');
			const buildingDoc = doc(buildingsColl, building_id);
			const residentsColl = collection(buildingDoc, 'residents');
			const residentDoc = doc(residentsColl, resident_id);
			const accountColl = collection(residentDoc, 'account');
			const resident = await getDoc(residentDoc);
			const account = await getDocs(
				query(accountColl, orderBy('year', 'desc'), orderBy('month', 'desc'))
			);
			update((val) => {
				val.data = { ...resident.data(), id: resident.id };
				val.account = [];
				account.forEach((bill) => {
					val.account[val.account.length] = { ...bill.data(), id: bill.id };
				});
			});
		}
	};
};
