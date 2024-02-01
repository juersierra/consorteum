<script lang="ts">
	import { onMount } from 'svelte';
  import type { PageData } from './$types';
	import { residentsStore, type Resident } from '$lib/store/residents.store';
	import { buildingStore } from '$lib/store/building.store';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  const modalStore = getModalStore();
	const toastStore = getToastStore();

    
  export let data: PageData;

	const formData = {
		id: '',
		name: '',
		position: '',
		percentage: {house: 0, park: 0}
	};

  const newResidentModal: ModalSettings = {
    type: 'component',
    component: 'residentModal',
    title: 'Nuevo residente',
    body: 'Ingrese los datos del nuevo residente',
	meta: {	formData },
    response: (r: Resident) => {
			if (r.percentage.house == 0 || r.percentage.park == 0) {
				const t: ToastSettings = {
						message: 'No se pude crear un residente con porcentajes 0',
						background: 'variant-filled-warning'
				};
				toastStore.trigger(t);
				return
			}
			const {id, ...resident} = r
			residentsStore.residentsHandler.addResident(data.building_id, resident);
		},
  };

	const triggerEditModal = (resident) => {
		formData.id = resident.id
		formData.name = resident.name;
		formData.position = resident.position;
		formData.percentage.house = resident.percentage.house;
		formData.percentage.park = resident.percentage.park;
		modalStore.trigger(editResidentModal);
	}
		
	const editResidentModal : ModalSettings = {
		type: 'component',
		component: 'residentModal',
		title: 'Editar residente',
		body: 'Modifique los datos del residente',
		meta: {	formData },
		response: (r: Resident) => {
			if (r.percentage.house == 0 || r.percentage.park == 0) {
				const t: ToastSettings = {
						message: 'No se pude editar un residente con porcentajes 0',
						background: 'variant-filled-warning'
				};
				toastStore.trigger(t);
				return
			}
			const {id, ...resident} = r
			residentsStore.residentsHandler.editResident(data.building_id, id, resident);
		},
	}

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
<div class="flex flex-row justify-between w-full">
	<h1 class="h1 align-middle p-2">Residentes</h1>
	<button class="btn variant-ghost-primary font-bold" on:click={() => modalStore.trigger(newResidentModal)}>
		<p class="hidden md:block invisible md:visible mr-2">Agregar Residente</p>
		<svg viewBox="0 0 56 56" class="w-8 h-8 !ml-0">
			<path fill="currentColor" d="M46.867 9.262c-2.39-2.39-5.765-2.766-9.75-2.766H18.836c-3.937 0-7.312.375-9.703 2.766c-2.39 2.39-2.742 5.742-2.742 9.656v18.094c0 4.008.351 7.336 2.742 9.726c2.39 2.39 5.766 2.766 9.773 2.766h18.211c3.985 0 7.36-.375 9.75-2.766c2.391-2.39 2.742-5.718 2.742-9.726V18.988c0-4.008-.351-7.36-2.742-9.726m-1.031 9.07v19.313c0 2.437-.305 4.921-1.71 6.351c-1.43 1.406-3.962 1.734-6.376 1.734h-19.5c-2.414 0-4.945-.328-6.351-1.734c-1.43-1.43-1.735-3.914-1.735-6.352V18.403c0-2.46.305-4.992 1.711-6.398c1.43-1.43 3.984-1.734 6.445-1.734h19.43c2.414 0 4.945.328 6.375 1.734c1.406 1.43 1.711 3.914 1.711 6.328M28 40.504c.938 0 1.688-.727 1.688-1.664v-9.164h9.164c.937 0 1.687-.797 1.687-1.664c0-.914-.75-1.688-1.687-1.688h-9.164v-9.187c0-.938-.75-1.664-1.688-1.664a1.64 1.64 0 0 0-1.664 1.664v9.187h-9.164c-.938 0-1.688.774-1.688 1.688c0 .867.75 1.664 1.688 1.664h9.164v9.164c0 .937.727 1.664 1.664 1.664" />
	</svg>
	</button>
</div>
<div class="table-container">
    <!-- Native Table Element -->
	<table class="table table-hover table-compact">
    <thead>
      <tr>
        <th class="!p-2 md:p-4 text-center">Depto/Cochera</th>
				<th class="!p-2 md:p-4 text-center" colspan="2">Nombre</th>
				<th class="!p-2 md:p-4 text-center">
					<div class="flex flex-col">
						<p>Porcentajes</p>
						<hr class="!border-t-2" />
						<div class="flex flex-row justify-around">
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...$$props}>
								<path fill="currentColor" d="M18 2H6c-1.103 0-2 .897-2 2v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4c0-1.103-.897-2-2-2m0 18H6V4h12z" />
								<path fill="currentColor" d="M8 6h3v2H8zm5 0h3v2h-3zm-5 4h3v2H8zm5 .031h3V12h-3zM8 14h3v2H8zm5 0h3v2h-3z" />
							</svg>
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 2048 2048" {...$$props}>
								<path fill="currentColor" d="M29 1075q-29 64-29 133v72q0 38 10 73t30 65t48 54t62 40q15 35 39 63t55 47t66 31t74 11q69 0 128-34t94-94h708q35 60 94 94t128 34q69 0 128-34t94-94h162q27 0 50-10t40-27t28-41t10-50v-256q0-79-30-149t-82-122t-122-83t-150-30h-37l-328-328q-27-27-62-41t-74-15H256v128h29zm1507 461q-27 0-50-10t-40-27t-28-41t-10-50q0-27 10-50t27-40t41-28t50-10q27 0 50 10t40 27t28 41t10 50q0 27-10 50t-27 40t-41 28t-50 10M896 512h267q26 0 45 19l237 237H896zM768 768H309l99-219q8-17 24-27t35-10h301zm-384 768q-27 0-50-10t-40-27t-28-41t-10-50q0-27 10-50t27-40t41-28t50-10q27 0 50 10t40 27t28 41t10 50q0 27-10 50t-27 40t-41 28t-50 10" />
							</svg>
						</div>
					</div>
				</th>
				<!-- <th class="!p-2 md:p-4 text-center">Porcentaje Cochera</th>
        <th class="!p-2 md:p-4 text-center">Porcentaje Total</th> -->
			</tr>
		</thead>
		<tbody>
      {#each $residentsStore.data as resident}
        <tr class="" on:click={() => triggerEditModal(resident)}>
          <td class="!p-2 md:p-4 text-center !align-middle !text-lg">{resident.position}</td>
          <td class="!p-2 md:p-4 text-center !align-middle !text-lg" colspan="2">{resident.name}</td>
          <!-- <td class="!p-2 md:p-4 text-center">{resident.percentage.house}%</td>
          <td class="!p-2 md:p-4 text-center">{resident.percentage.park}%</td> -->
					
          <td class="!p-2 md:p-4 text-center">
						<div class="flex flex-col !text-lg">
							<div class="flex flex-row justify-around">
								<p>{resident.percentage.house}%</p>
								<p>{resident.percentage.park}%</p>
							</div>
							{resident.percentage.house + resident.percentage.park}%
        </tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
        <td colspan="2"></td>
				<th class="text-end">Porcentaje total</th>
				<td class="font-bold text-center {totalPercentages==100 ? 'text-green-500' : 'text-red-500'}">{$residentsStore.total_perc}%</td>
			</tr>
		</tfoot>
	</table>
</div>
{/if}