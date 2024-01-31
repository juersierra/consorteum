<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
	import { residentsStore, type Resident } from '$lib/store/residents.store';
	import { buildingStore } from '$lib/store/building.store';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    const modalStore = getModalStore();
    
    export let data: PageData;

    const newResidentModal: ModalSettings = {
        type: 'component',
        component: 'newResidentModal',
        title: 'Nuevo residente',
        body: 'Ingrese los datos del nuevo residente',
        response: (r: Resident) => residentsStore.residentsHandler.addResident(data.building_id, r),
    };

    $: totalPercentages = $residentsStore.total_perc

    onMount(async ()=> {
        await buildingStore.buildingHandler.getBuilding(data.building_id)
        await residentsStore.residentsHandler.getResidents(data.building_id)
    })
</script>

{#if $residentsStore.loading}
<section class="card w-full">
    <div class="p-4 space-y-4">
        <div class="placeholder animate-pulse p-8" />
		<div class="grid grid-cols-12 gap-8">
            <div class="placeholder animate-pulse" />
			<div class="" />
			<div class="col-span-3 placeholder animate-pulse" />
			<div class="col-span-2" />
			<div class="placeholder animate-pulse" />
			<div class="col-span-2" />
			<div class="col-span-1 placeholder animate-pulse" />
		</div>
		<div class="grid grid-cols-4 gap-4">
            <div class="placeholder" />
			<div class="placeholder" />
			<div class="placeholder" />
			<div class="placeholder" />
		</div>
	</div>
</section>
{:else}
<button on:click={() => modalStore.trigger(newResidentModal)}>+</button>
<div class="table-container">
    <!-- Native Table Element -->
	<table class="table table-hover">
        <thead>
            <tr>
                <th>Depto/Cochera</th>
				<th>Nombre</th>
				<th>Porcentaje Depto</th>
				<th>Porcentaje Cochera</th>
                <th>Porcentaje Total</th>
			</tr>
		</thead>
		<tbody>
            {#each $residentsStore.data as resident, i}
            <tr>
                <td>{resident.position}</td>
                <td>{resident.name}</td>
                <td>{resident.percentage.house}%</td>
                <td>{resident.percentage.park}%</td>
                <td>{resident.percentage.house + resident.percentage.park}%</td>
            </tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
                <td colspan="3"></td>
				<th>Calculated Total Weight</th>
				<td class="font-bold {totalPercentages==100 ? 'text-green-500' : 'text-red-500'}">{$residentsStore.total_perc}%</td>
			</tr>
		</tfoot>
	</table>
</div>
{/if}