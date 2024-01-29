<script lang="ts">
    import { auth, db } from '$lib/firebase/firebase';
    import { doc, getDoc, setDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import "../app.css";
    import type { LayoutData } from './$types';
	import { authStore } from '../store/store';
    
    export let data: LayoutData;

    onMount(() => {
        console.log('mounting');
        const unsubscribe = auth.onAuthStateChanged(async user => {
            const currentPath = window.location.pathname
            if (!user && !["/"].includes(currentPath)) {
                window.location.href= "/";
                return
            }

            if (user && currentPath === "/") {
                window.location.href = "/buildings"
                return
            }

            if (!user) {
                return
            }

            let dataToSetToStore;
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                const userRef = doc(db, 'user', user.uid);
                dataToSetToStore = {
                        email: user?.email,
                        buildings: [],
                    }
                await setDoc(
                    userRef, dataToSetToStore,
                    { merge: true }
                )
            } else {
                const userData = docSnap.data()
                dataToSetToStore = userData
            }
            authStore.update(curr => {
                return {
                    ...curr, user, data: dataToSetToStore, loading: false
                }
            })
        })
        
    })
</script>

<slot/>