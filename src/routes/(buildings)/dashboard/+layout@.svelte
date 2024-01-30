<script lang="ts">
    import Loading from '$lib/assets/loading.svg';
	import { authStore } from '$lib/store/auth.store';
    import { AppBar, AppShell } from '@skeletonlabs/skeleton';
    import Nav from '$lib/components/navigation/Nav.svelte';
    import { initializeStores,
        //DRAWER
        Drawer, getDrawerStore 
    } from '@skeletonlabs/skeleton';
    initializeStores();
    
    //SET DRAWER
    const drawerStore = getDrawerStore();
    function drawerOpen(): void {
        drawerStore.open({});
    }

    $: loading = $authStore.loading; 

    const handleLogout = async () => {
        await authStore.authHandlers.logout()
    }


</script>

<Drawer><Nav/></Drawer>
<AppShell>
	<svelte:fragment slot="header">
        <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
            (title)
            <svelte:fragment slot="trail">
                <button on:click={handleLogout} class="btn-icon variant-filled-primary">
                    <svg class="w-6" viewBox="0 0 24 24">
                        <path fill="currentColor" d="m17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5z" />
                    </svg>
                </button>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
	{#if loading}
            <div class="flex h-[calc(100vh-10rem)] w-full flex-col items-center justify-center">
                <img src={Loading} alt="loading.gif" class="w-[30%] lg:w-[15%]" />
            </div>
        {:else}
            <slot />
        {/if}
	<svelte:fragment slot="pageFooter"></svelte:fragment>
</AppShell>