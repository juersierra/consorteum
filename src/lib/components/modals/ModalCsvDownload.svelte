<script lang="ts">
	import { billsStore } from '$lib/store/bills.store';
	import { periodStore } from '$lib/store/period.store';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import DownloadCsv from '../buttons/DownloadCSV.svelte';
	export let parent: SvelteComponent;
	const modalStore = getModalStore();

	const filterForCSVBills = () => {
    const arr = $billsStore.data.map((bill) => {
      return {
        proveedor: bill.vendor,
        gasto: bill.description || '------',
        monto_porcentual: bill.is_percentage ? bill.amount : 0,
        monto_equitativo: !bill.is_percentage ? bill.amount : 0,
        _: '',
      }
    })
    arr.push()
		return arr as any[];
	};

	const filterForCSVResidents = () => {
    const arr = $billsStore.data.map((bill) => {
      return {
        proveedor: bill.vendor,
        gasto: bill.description || '------',
        monto_porcentual: bill.is_percentage ? bill.amount : 0,
        monto_equitativo: !bill.is_percentage ? bill.amount : 0,
        _: '',
      }
    })
    arr.push()
		return arr as any[];
	};

	const months = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC"
  ];

	function onFormSubmit(): void {
		modalStore.close();
	}

</script>

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class='text-2xl font-bold'>{$modalStore[0].title}</header>
		<article>{$modalStore[0].body}</article>
		<div class="flex flex-row justify-around">
			<DownloadCsv csvData={filterForCSVBills()} filename="Gastos {$periodStore.data ? months[$periodStore.data.month] : ''}/{$periodStore.data?.year}" name="bills"/>
			<DownloadCsv csvData={filterForCSVResidents()} filename="Residentes" name="residents"/>
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
		</footer>
	</div>
{/if}