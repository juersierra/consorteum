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
		name: 'Nombre',
		address: 'Direccion',
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class='text-2xl font-bold'>{$modalStore[0].title}</header>
		<article>{$modalStore[0].body}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
			<label class="label">
				<span>Nombre</span>
				<input class="input px-2" type="text" bind:value={formData.name} placeholder="Nombre" />
			</label>
			<label class="label">
				<span>Dirección</span>
				<input class="input px-2" type="text" bind:value={formData.address} placeholder="Dirección" />
			</label>
			<!-- <label class="label">
				<span>Email</span>
				<input class="input px-2" type="email" bind:value={formData.email} placeholder="Enter email address..." />
			</label> -->
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
			<button class="btn variant-filled-primary text-tertiary-500" on:click={onFormSubmit}>Crear</button>
		</footer>
	</div>
{/if}