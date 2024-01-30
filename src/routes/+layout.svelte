<script lang="ts">
    import { auth, db } from '$lib/firebase/firebase';
    import { doc, getDoc, setDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import "../app.css";
	import { authStore } from '$lib/store/auth.store';

    import { Toast } from '@skeletonlabs/skeleton';

    import { initializeStores } from '@skeletonlabs/skeleton';
    initializeStores();
    
    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            console.log('onAuthStateChanged', user);

            const currentPath = window.location.pathname
            if (!user && !["/login"].includes(currentPath)) {
                window.location.href= "/login";
                return
            }
            if (user && ["/login"].includes(currentPath)) {
                window.location.href = "/"
                return
            }
            if (!user) {
                return
            } else {
                authStore.update(curr => {
                return {
                    ...curr, user, data: user, loading: false
                }
            })
            }

            let dataToSetToStore;
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                const userRef = doc(db, 'user', user.uid);
                dataToSetToStore = {
                    email: user?.email,
                }
                await setDoc(
                    userRef, dataToSetToStore,
                    { merge: true }
                )
            } else {
                const userData = docSnap.data()
                dataToSetToStore = userData
            }
        })
        
    })
</script>

<Toast />
<slot/>