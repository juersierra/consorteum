<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let parent: SvelteComponent;
	const modalStore = getModalStore();

	// Form Data
	const formData = {
		id: $modalStore[0].meta.formData.id,
		name: $modalStore[0].meta.formData.name,
		position: $modalStore[0].meta.formData.position,
		percentage: 
			{
				house: $modalStore[0].meta.formData.percentage.house,
				park: $modalStore[0].meta.formData.percentage.park
			}
	};

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
				<span>Departamento</span>
				<input class="input px-2" type="text" bind:value={formData.position} placeholder="Departamento" />
			</label>
			<label class="label">
				<span>Porcentaje Departamento</span>
				<input class="input px-2" type="number" bind:value={formData.percentage.house} />
			</label>
			<label class="label">
				<span>Porcentaje Estacionamiento</span>
				<input class="input px-2" type="number" bind:value={formData.percentage.park} />
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
			<button class="btn variant-filled-primary text-tertiary-500" on:click={onFormSubmit}>Crear</button>
		</footer>
	</div>
{/if}