import { auth } from '$lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { writable } from 'svelte/store';

interface User {
	id: string;
	email: string;
}
interface Store {
	loading: boolean;
	user: User | null;
}

const store = () => {
	const { subscribe, update, set } = writable<Store>({
		user: null,
		loading: true
	});

	const authHandlers = {
		signup: async (email: string, pass: string) => {
			await createUserWithEmailAndPassword(auth, email, pass)
				.then((userCredential) => {
					const user = userCredential.user;
					update((val) => {
						val.user = user;
						return { ...val, loading: false };
					});
				})
				.catch((error) => {
					console.log(error);
				});
		},
		login: async (email: string, pass: string) => {
			await signInWithEmailAndPassword(auth, email, pass)
				.then((userCredential) => {
					const user = userCredential.user;
					update((val) => {
						val.user = user;
						return { ...val, loading: false };
					});
				})
				.catch((error) => {
					console.log(error);
				});
		},
		logout: async () => {
			await signOut(auth).then(() => {
				update((val) => {
					val.user = null;
					return { ...val, loading: false };
				});
			});
		}
	};

	return { subscribe, update, set, authHandlers };
};

export const authStore = store();
