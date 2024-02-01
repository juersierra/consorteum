<script lang="ts">
	import Loading from '$lib/assets/loading.svg';
	import { buildingStore } from '$lib/store/building.store';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { periodStore } from '$lib/store/period.store';
    
    export let data: PageData;

    $: loading = $buildingStore.loading;
    
    onMount(async () => {
        await buildingStore.buildingHandler.getBuilding(data.building_id)
    })
    
</script>

{#if loading}
<div class="h-full w-full flex flex-col items-center justify-center">
    <img src={Loading} alt="loading.gif" class="w-[120px] lg:w-[210px]" />
</div>
{:else}
    {$buildingStore.data?.name}
    {JSON.stringify($buildingStore.periods)}
    <div class="flex flex-col min-h-16 ">
        DASHBOARD
        agfpoasjfpo
        apogjasdpog
    </div>
{/if}