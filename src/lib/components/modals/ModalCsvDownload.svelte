<script lang="ts">
	import { billsStore } from '$lib/store/bills.store';
	import { periodStore } from '$lib/store/period.store';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import DownloadCsv from '../buttons/DownloadCSV.svelte';
	import { residentsStore } from '$lib/store/residents.store';
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
    console.log($billsStore.data.length+1);
    $residentsStore.data.forEach((resident) => {
      console.log(resident.percentage.house+resident.percentage.park);
    })
    console.log($billsStore.data.length+1);
    console.log($billsStore.total_percentage);
    console.log($billsStore.total_even);

    const arr = $residentsStore.data.map((resident) => {
      return {
        departamento_cochera: resident.position,
        nombre: resident.name,
        porc_depto: resident.percentage.house || '',
        porc_cochera: resident.percentage.park || '',
        porc_total: resident.percentage.house+resident.percentage.park || '',
        total_porcentaje: (resident.percentage.house+resident.percentage.park) * $billsStore.total_percentage / 100 || '',
        total_equitativo: $billsStore.total_even / ($residentsStore.data.length) || '',
        TOTAL: ''
      }
    })
    arr.push({departamento_cochera: '', nombre: '', porc_depto: '', porc_cochera: '', porc_total: `=SUMA(E2:E${arr.length+1})`, total_porcentaje:`=SUMA(F2:F${arr.length+1})`, total_equitativo: `=SUMA(G2:G${arr.length+1})`, TOTAL: `=SUMA(F${arr.length+2}:G${arr.length+2})`})
		return arr as any[]
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
			<DownloadCsv csvData={filterForCSVResidents()} filename="Residentes {$periodStore.data ? months[$periodStore.data.month] : ''}/{$periodStore.data?.year}" name="residents"/>
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
		</footer>
	</div>
{/if}