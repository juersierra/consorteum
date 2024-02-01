<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
	import { buildingStore } from '$lib/store/building.store';
    
    export let data: PageData;

    onMount(async ()=> {
      await buildingStore.buildingHandler.getBuilding(data.building_id)
  })
</script>

fixed bills