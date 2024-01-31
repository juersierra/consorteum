<script lang="ts">
    import Loading from '$lib/assets/loading.svg';
    import Nav from '$lib/components/navigation/Nav.svelte';
    import { authStore } from '$lib/store/auth.store';
    import { buildingStore } from '$lib/store/building.store';
    import { AppBar, AppShell, Drawer, getDrawerStore, initializeStores, Modal, type ModalComponent } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';
    import type { PageData } from '../$types';
	import ModalNewResident from '$lib/components/buildings/ModalNewResident.svelte';
    
    export let data: PageData;

    initializeStores();
    const modalRegistry: Record<string, ModalComponent> = {
        newResidentModal: {ref: ModalNewResident}
    }
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

<Modal components={modalRegistry}/>
<Drawer><Nav building_id={data.building_id}/></Drawer>
{#if loading}
    <div class="flex h-[calc(100vh-5rem)] w-full flex-col items-center justify-center">
        <img src={Loading} alt="loading.gif" class="w-[120px] lg:w-[210px]" />
    </div>
{:else}
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
        <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
            <svelte:fragment slot="lead">
                <div class="flex items-center">
                    <button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
                        <span>
                            <svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
                                <rect width="100" height="20" />
                                <rect y="30" width="100" height="20" />
                                <rect y="60" width="100" height="20" />
                            </svg>
                        </span>
                    </button>
                </div>
            </svelte:fragment>
            <div class="flex flex-row pl-4 gap-x-2">
                <svg class="h-8 text-tertiary-500" viewBox="0 0 512 512">a
                    <path fill="currentColor" d="M256 26.2L52 135h408zM73 153v14h366v-14zm16 32v206h30V185zm101.334 0v206h30V185zm101.332 0v206h30V185zM393 185v206h30V185zM73 409v30h366v-30zm-32 48v30h430v-30z" />
                </svg>
                <h3 class="h3 h-full align-middle text-tertiary-700">CONSORTEUM</h3>
            </div>
            <svelte:fragment slot="trail">
                <button on:click={handleLogout} class="btn-icon variant-filled-primary">
                    <svg class="w-6" viewBox="0 0 24 24">
                        <path fill="currentColor" d="m17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5z" />
                    </svg>
                </button>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
        <Nav building_id={data.building_id}/>
    </svelte:fragment>
    <div class="container h-[calc(100vh-5rem)] p-10 space-y-4">
        <slot />
    </div>
	<svelte:fragment slot="pageFooter"></svelte:fragment>
</AppShell>
{/if}