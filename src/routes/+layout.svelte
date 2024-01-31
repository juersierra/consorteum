<script lang="ts">
    import ModalNewBuilding from '$lib/components/buildings/ModalNewBuilding.svelte';
    import ModalNewResident from '$lib/components/buildings/ModalNewResident.svelte';
    import { auth, db } from '$lib/firebase/firebase';
    import { authStore } from '$lib/store/auth.store';
    import { Modal, Toast, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton';
    import { doc, getDoc, setDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import "../app.css";
    initializeStores();

    const modalRegistry: Record<string, ModalComponent> = {
        newBuildingModal: {ref: ModalNewBuilding},
        newResidentModal: {ref: ModalNewResident}
    }
    
    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
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
                    ...curr, user, loading: false
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
<Modal components={modalRegistry}/>
<slot/>