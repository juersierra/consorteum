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
        descripción: bill.description || '------',
        monto_porcentual: bill.is_percentage ? bill.amount : '',
        monto_equitativo: !bill.is_percentage ? bill.amount : '',
        TOTAL: '',
      }
    })

    arr.push({proveedor: '', descripción: '', monto_porcentual: `=SUMA(C2:C${arr.length+1})`, monto_equitativo: `=SUMA(D2:D${arr.length+1})`, TOTAL: `=SUMA(C${arr.length+2}:D${arr.length+2})`})
		return arr as any[];
	};

	const filterForCSVResidents = () => {
    const totals: {percentage_total: number, even_total: number} = $billsStore.data.reduce((totals, bill) => {
      if (bill.is_percentage) {
        totals.percentage_total += bill.amount
      } else {
        totals.even_total += bill.amount
      }
    }, {percentage_total: 0, even_total:0})
    console.log(totals.percentage_total);
    console.log(totals.even_total);
    // arr.push({proveedor: '', gasto: '', monto_porcentual: percentage_total, monto_equitativo: even_total, TOTAL: percentage_total+even_total})
		return
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

</script>

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class='text-2xl font-bold'>{$modalStore[0].title}</header>
		<article>{$modalStore[0].body}</article>
		<div class="flex flex-row justify-around">
			<DownloadCsv csvData={filterForCSVBills()} filename="Gastos {$periodStore.data ? months[$periodStore.data.month] : ''}/{$periodStore.data?.year}" name="bills"/>
			<!-- <DownloadCsv csvData={filterForCSVResidents()} filename="Residentes" name="residents"/> -->
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
		</footer>
	</div>
{/if}