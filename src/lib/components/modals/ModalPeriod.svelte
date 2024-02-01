<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';
	import { periodStore } from '$lib/store/period.store';
	import { buildingStore } from '$lib/store/building.store';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// Local
	let period = $periodStore.data?.id;
	const modalStore = getModalStore();

	// Handle Form Submission
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(period);
		modalStore.close();
	}

  const months = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];


</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class='text-2xl font-bold'>Seleccione un período</header>
		<!-- <article>{$modalStore[0].body}</article> -->
		<ListBox class="border border-surface-500 p-4 rounded-container-token">
      {#each $buildingStore.periods as item}
        <ListBoxItem bind:group={period} name={item.id} value={item.id}>
          {months[item.month-1]}/{item.year}
        </ListBoxItem>
      {/each}
		</ListBox>
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Seleccionar</button>
    </footer>
	</div>
{/if}