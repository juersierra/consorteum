<script lang="ts">
	import { buildingsStore, type Building } from '$lib/store/buildings.store';
    import Loading from '$lib/assets/loading.svg';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
    export let data: PageData;
    import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    const modalStore = getModalStore();

    $: loading = $buildingsStore.loading; 

    const modal: ModalSettings = {
	type: 'component',
	component: 'newBuildingModal',
    title: 'Nuevo edificio',
    body: 'Ingrese los datos del nuevo edificio',
	response: (r: Building) => buildingsStore.buildingsHandler.createBuilding(r),
    };

    onMount(async () => {
        await buildingsStore.buildingsHandler.getBuildings()
    })
</script>
{#if loading}
          <div class="flex h-[calc(100vh-10rem)] w-full flex-col items-center justify-center">
              <img src={Loading} alt="loading.gif" class="w-[30%] lg:w-[15%]" />
          </div>
{:else}
      <div class="relative snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10">
          {#each $buildingsStore.data as building}
          <a href="/{building.id}/dashboard" class="snap-start shrink-0 card py-20 w-40 md:w-80 text-center text-surface-200">
            <div class="card-header">{building.name}</div>
            <div class="p-4">{building.address}</div>
        </a>
        {/each}
        <button on:click={() => modalStore.trigger(modal)} class="snap-start shrink-0 card w-40 md:w-80 flex flex-col items-center justify-center text-primary-500">
            <p class="p-2 text-center">Crear Edificio</p>
            <svg viewBox="0 0 56 56" class="w-12 h-12">
                <path fill="currentColor" d="M46.867 9.262c-2.39-2.39-5.765-2.766-9.75-2.766H18.836c-3.937 0-7.312.375-9.703 2.766c-2.39 2.39-2.742 5.742-2.742 9.656v18.094c0 4.008.351 7.336 2.742 9.726c2.39 2.39 5.766 2.766 9.773 2.766h18.211c3.985 0 7.36-.375 9.75-2.766c2.391-2.39 2.742-5.718 2.742-9.726V18.988c0-4.008-.351-7.36-2.742-9.726m-1.031 9.07v19.313c0 2.437-.305 4.921-1.71 6.351c-1.43 1.406-3.962 1.734-6.376 1.734h-19.5c-2.414 0-4.945-.328-6.351-1.734c-1.43-1.43-1.735-3.914-1.735-6.352V18.403c0-2.46.305-4.992 1.711-6.398c1.43-1.43 3.984-1.734 6.445-1.734h19.43c2.414 0 4.945.328 6.375 1.734c1.406 1.43 1.711 3.914 1.711 6.328M28 40.504c.938 0 1.688-.727 1.688-1.664v-9.164h9.164c.937 0 1.687-.797 1.687-1.664c0-.914-.75-1.688-1.687-1.688h-9.164v-9.187c0-.938-.75-1.664-1.688-1.664a1.64 1.64 0 0 0-1.664 1.664v9.187h-9.164c-.938 0-1.688.774-1.688 1.688c0 .867.75 1.664 1.688 1.664h9.164v9.164c0 .937.727 1.664 1.664 1.664" />
            </svg>
        </button>
    </div>
{/if}