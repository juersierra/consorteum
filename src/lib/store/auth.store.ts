import { auth } from '$lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { writable } from 'svelte/store';

const store = () => {
	const { subscribe, update, set } = writable({
		user: null,
		loading: true,
		data: {}
	});

	const authHandlers = {
		signup: async (email: string, pass: string) => {
			await createUserWithEmailAndPassword(auth, email, pass)
				.then((userCredential) => {
					const user = userCredential.user;
					update((val) => {
						val.data = user;
						return val;
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
						val.data = user;
						return val;
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
					val.data = {};
					return val;
				});
			});
		}
	};

	return { subscribe, update, set, authHandlers };
};

export const authStore = store();
