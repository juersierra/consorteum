<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Form Data
	const formData = {
		month: new Date().getMonth(),
		year: new Date().getFullYear()
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

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

</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class='text-2xl font-bold'>{$modalStore[0].title}</header>
		<article>{$modalStore[0].body}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
			<div class="flex flex-row gap-x-4">
				<label class="label">
					<span>Mes</span>
					<select class="select px-2" bind:value={formData.month}>
						{#each months as month, i}
						<option value={i}>{month}</option>
						{/each}
					</select>
				</label>
				<label class="label">
					<span>Año</span>
					<input class="input px-2" type="number" bind:value={formData.year} />
				</label>
			</div>

		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
			<button class="btn variant-filled-primary text-tertiary-500" on:click={onFormSubmit}>Crear</button>
		</footer>
	</div>
{/if}