<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { fixedBillsStore, type FixedBill } from '$lib/store/fixedBills.store';
	export let parent: SvelteComponent;
	const modalStore = getModalStore();

	// Form Data
	const formData = {
		id: $modalStore[0].meta.formData.id,
		vendor: $modalStore[0].meta.formData.vendor,
		description: $modalStore[0].meta.formData.description,
		is_percentage: $modalStore[0].meta.formData.is_percentage,
		amount: $modalStore[0].meta.formData.amount
	};

	let selectedFixedBill:FixedBill = {
		vendor: $modalStore[0].meta.formData.vendor,
		description: $modalStore[0].meta.formData.description,
		is_percentage: $modalStore[0].meta.formData.is_percentage,
	}

	const selectFixedBill = () => {
		formData.vendor = selectedFixedBill.vendor
		formData.description = selectedFixedBill.description
		formData.is_percentage = selectedFixedBill.is_percentage
	}

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
		
	}

</script>

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class='text-2xl font-bold'>{$modalStore[0].title}</header>
		<div class="flex flex-row justify-between">
			<article class="align-middle h-max">{$modalStore[0].body}</article>
			<select class="select w-min" bind:value={selectedFixedBill} on:change={() => selectFixedBill()}>
				<option value="">Gastos fijos</option>
				{#each $fixedBillsStore.data as fixedBill}
					 <option value={fixedBill}>{fixedBill.description}</option>
				{/each}
			</select>
		</div>
		<form class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
			<div class="flex flex-row gap-x-4">
				<label class="label">
					<span>Proveedor</span>
					<input class="input px-2" type="text" bind:value={formData.vendor} placeholder="Proveedor" />
				</label>
				<label class="flex items-center space-x-2 pt-7">
					<input class="checkbox" type="checkbox" bind:checked={formData.is_percentage} />
					<p>Gasto Porcentual</p>
				</label>
			</div>
			<label class="label">
				<span>Descripción</span>
				<input class="input px-2" type="text" bind:value={formData.description} placeholder="Descripción" />
			</label>
			<label class="label">
				<span>Monto</span>
				<input class="input px-2" type="number" bind:value={formData.amount} />
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
			<button class="btn variant-filled-primary text-tertiary-500" on:click={onFormSubmit}>Crear/Editar</button>
		</footer>
	</div>
{/if}

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
				 -webkit-appearance: none;
					margin: 0;
	}

	input[type=number] {
			-moz-appearance: textfield;
	}
</style>