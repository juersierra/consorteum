<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { SlideToggle, getModalStore } from '@skeletonlabs/skeleton';
	export let parent: SvelteComponent;
	const modalStore = getModalStore();

	// Form Data
	const formData = {
		id: $modalStore[0].meta.formData.id,
		vendor: $modalStore[0].meta.formData.vendor,
		description: $modalStore[0].meta.formData.description,
		is_percentage: $modalStore[0].meta.formData.is_percentage
	};

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
		
	}

</script>

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class='text-2xl font-bold'>{$modalStore[0].title}</header>
		<article>{$modalStore[0].body}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
			<label class="label">
				<span>Proveedor</span>
				<input class="input px-2" type="text" bind:value={formData.vendor} placeholder="Proveedor" />
			</label>
			<label class="label">
				<span>Descripción</span>
				<input class="input px-2" type="text" bind:value={formData.description} placeholder="Descripción" />
			</label>
			<SlideToggle name="is_percentage" bind:checked={formData.is_percentage}>Es Porcentual?</SlideToggle>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
			<button class="btn variant-filled-primary text-tertiary-500" on:click={onFormSubmit}>Crear</button>
		</footer>
	</div>
{/if}