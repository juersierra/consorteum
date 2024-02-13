<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';
	import { page } from "$app/stores";
	import { ListBox, ListBoxItem, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
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

	const formData = {
		month: new Date().getMonth(),
		year: new Date().getFullYear()
	}

	const triggerCreateModal = () => {
		modalStore.close()
		modalStore.trigger(newPeriodModal);
	}

  const newPeriodModal: ModalSettings = {
    type: 'component',
    component: 'newPeriodModal',
    title: 'Nuevo período',
    response: (r) => {
			const d = new Date();
      formData.month = d.getMonth()
      formData.year = d.getFullYear();
			if(!r) return
			const {id, ...period} = r
			periodStore.periodHandler.createPeriod($page.params.building_id, period);
		},
  };

	const months = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre"
	]

onMount(() => {
	console.log($buildingStore.periods);
})

</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class='text-2xl font-bold'>Seleccione un período</header>
		<!-- <article>{$modalStore[0].body}</article> -->
		<ListBox class="border border-surface-500 p-4 rounded-container-token">
      {#each $buildingStore.periods as per}
        <ListBoxItem bind:group={period} name={per.id} value={per.id}>
          {months[per.month]}/{per.year}
        </ListBoxItem>
      {/each}
		</ListBox>
		<footer class="modal-footer {parent.regionFooter} flex flex-row justify-between">
			<button class="btn variant-ghost-primary font-bold" on:click={() => triggerCreateModal()}>
				<svg viewBox="0 0 56 56" class="w-8 h-8 !ml-0">
					<path fill="currentColor" d="M46.867 9.262c-2.39-2.39-5.765-2.766-9.75-2.766H18.836c-3.937 0-7.312.375-9.703 2.766c-2.39 2.39-2.742 5.742-2.742 9.656v18.094c0 4.008.351 7.336 2.742 9.726c2.39 2.39 5.766 2.766 9.773 2.766h18.211c3.985 0 7.36-.375 9.75-2.766c2.391-2.39 2.742-5.718 2.742-9.726V18.988c0-4.008-.351-7.36-2.742-9.726m-1.031 9.07v19.313c0 2.437-.305 4.921-1.71 6.351c-1.43 1.406-3.962 1.734-6.376 1.734h-19.5c-2.414 0-4.945-.328-6.351-1.734c-1.43-1.43-1.735-3.914-1.735-6.352V18.403c0-2.46.305-4.992 1.711-6.398c1.43-1.43 3.984-1.734 6.445-1.734h19.43c2.414 0 4.945.328 6.375 1.734c1.406 1.43 1.711 3.914 1.711 6.328M28 40.504c.938 0 1.688-.727 1.688-1.664v-9.164h9.164c.937 0 1.687-.797 1.687-1.664c0-.914-.75-1.688-1.687-1.688h-9.164v-9.187c0-.938-.75-1.664-1.688-1.664a1.64 1.64 0 0 0-1.664 1.664v9.187h-9.164c-.938 0-1.688.774-1.688 1.688c0 .867.75 1.664 1.688 1.664h9.164v9.164c0 .937.727 1.664 1.664 1.664" />
				</svg>
			</button>
			<div class="flex flex-row gap-x-2">
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
				<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Seleccionar</button>
			</div>
    </footer>
	</div>
{/if}