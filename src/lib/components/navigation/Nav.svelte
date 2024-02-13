<script lang="ts">
	import { buildingStore } from "$lib/store/building.store";
	import { LightSwitch, getDrawerStore } from "@skeletonlabs/skeleton";
	import Period from "./Period.svelte";
	import { page } from "$app/stores";

	export let building_id: string;
	
	const drawerStore = getDrawerStore();
	function drawerClose(): void {
		drawerStore.close();
	}
	$: [navPlace] = $page.url.pathname.split('/').slice(-1)
	

</script>

<nav class="list-nav p-4">
	<div class="lg:fixed mt-4 lg:mt-0 lg:top-7 z-50"><LightSwitch /></div>
	<ul class="mt-8 lg:mt-0">
		<li class="variant-ghost-primary rounded-sm ring-4 py-1">
			<a on:click={drawerClose} href="/" class="flex flex-row justify-between">
				<p>{$buildingStore.data ? $buildingStore.data.name : '...' }</p>
				<svg class="h-6" viewBox="0 0 16 16">
					<g fill="currentColor">
						<path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
						<path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
					</g>
				</svg>
			</a>
		</li>
		<li class='{navPlace == 'residents' ? 'variant-ghost-tertiary' : 'variant-ghost-primary'} rounded-sm ring-0'><a on:click={drawerClose} href="/{building_id}/residents">Residentes</a></li>
		<li class="{navPlace == 'fixed_bills' ? 'variant-ghost-tertiary' : 'variant-ghost-primary'} rounded-sm ring-0"><a on:click={drawerClose} href="/{building_id}/fixed_bills">Gastos Fijos</a></li>
		<Period/>
		<li class="{navPlace == 'bills' ? 'variant-ghost-tertiary' : 'variant-ghost-secondary'} rounded-sm ring-0"><a on:click={drawerClose} href="/{building_id}/bills">Gastos</a></li>
	</ul>
</nav>