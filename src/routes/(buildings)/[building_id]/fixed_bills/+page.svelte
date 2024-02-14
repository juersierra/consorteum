<script lang="ts">
	import { fixedBillsStore, type FixedBill } from '$lib/store/fixedBills.store';
	import { getModalStore, getToastStore, popup, type ModalSettings, type PopupSettings } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
	import { buildingStore } from '$lib/store/building.store';
	import { onMount } from 'svelte';
  const modalStore = getModalStore();
    
    export let data: PageData;

    const formData: FixedBill = {
		id: '',
	  description: '',
	  vendor: '',
    is_percentage: true,
	};

  const popupHover: PopupSettings = {
    event: 'hover',
    target: 'popupHover',
    placement: 'bottom'
  }

  const triggerCreateModal = () => {
		formData.description = '';
		formData.vendor = '';
    formData.is_percentage = true;
		modalStore.trigger(newFixedBillModal);
	}

  const newFixedBillModal: ModalSettings = {
    type: 'component',
    component: 'fixedBillModal',
    title: 'Nuevo gasto fijo',
    body: 'Ingrese los datos del gasto fijo',
    meta: {	formData },
    response: (r: FixedBill) => {
      formData.id = ''
      formData.description = '';
      formData.vendor = '';
      formData.is_percentage = true;
			if(!r) return
			const {id, ...fixedBill} = r
			fixedBillsStore.fixedBillsHandler.addFixedBill(data.building_id, fixedBill);
		},
  };

	const triggerEditModal = (fixedBill: FixedBill) => {
		formData.id = fixedBill.id
		formData.description = fixedBill.description;
		formData.vendor = fixedBill.vendor;
    formData.is_percentage = fixedBill.is_percentage;
		modalStore.trigger(editFixedBillModal);
	}
		
	const editFixedBillModal : ModalSettings = {
		type: 'component',
		component: 'fixedBillModal',
		title: 'Editar gasto fijo',
		body: 'Modifique el gasto fijo',
		meta: {	formData },
		response: (r: FixedBill) => {
			if(!r) return
			const {id, ...fixedBill} = r
			fixedBillsStore.fixedBillsHandler.editFixedBill(data.building_id, id, fixedBill);
		},
	}

  const triggerDeleteModal = (fixedBill_id:string) => {
    const modal: ModalSettings = {
      type: 'confirm',
      title: 'Por favor confirme',
      body: '¿Esta seguro que desea eliminar el gasto fijo?',
      response: (r) => {
        if (r) fixedBillsStore.fixedBillsHandler.deleteFixedBill(data.building_id, fixedBill_id);
      }
  }
  modalStore.trigger(modal)
}

  onMount(async ()=> {
      await buildingStore.buildingHandler.getBuilding(data.building_id)
      await fixedBillsStore.fixedBillsHandler.getFixedBills(data.building_id)
  })

</script>

{#if $fixedBillsStore.loading}
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
	<h1 class="h1 align-middle p-2">Gastos Fijos</h1>
	<button class="btn variant-ghost-primary font-bold" on:click={() => triggerCreateModal()}>
    <p class="hidden md:block invisible md:visible mr-2">Agregar Gasto</p>
		<svg viewBox="0 0 56 56" class="w-8 h-8 !ml-0">
			<path fill="currentColor" d="M46.867 9.262c-2.39-2.39-5.765-2.766-9.75-2.766H18.836c-3.937 0-7.312.375-9.703 2.766c-2.39 2.39-2.742 5.742-2.742 9.656v18.094c0 4.008.351 7.336 2.742 9.726c2.39 2.39 5.766 2.766 9.773 2.766h18.211c3.985 0 7.36-.375 9.75-2.766c2.391-2.39 2.742-5.718 2.742-9.726V18.988c0-4.008-.351-7.36-2.742-9.726m-1.031 9.07v19.313c0 2.437-.305 4.921-1.71 6.351c-1.43 1.406-3.962 1.734-6.376 1.734h-19.5c-2.414 0-4.945-.328-6.351-1.734c-1.43-1.43-1.735-3.914-1.735-6.352V18.403c0-2.46.305-4.992 1.711-6.398c1.43-1.43 3.984-1.734 6.445-1.734h19.43c2.414 0 4.945.328 6.375 1.734c1.406 1.43 1.711 3.914 1.711 6.328M28 40.504c.938 0 1.688-.727 1.688-1.664v-9.164h9.164c.937 0 1.687-.797 1.687-1.664c0-.914-.75-1.688-1.687-1.688h-9.164v-9.187c0-.938-.75-1.664-1.688-1.664a1.64 1.64 0 0 0-1.664 1.664v9.187h-9.164c-.938 0-1.688.774-1.688 1.688c0 .867.75 1.664 1.688 1.664h9.164v9.164c0 .937.727 1.664 1.664 1.664" />
	</svg>
	</button>
</div>
<div class="table-container">
	<table class="table table-hover table-compact">
    <thead>
      <tr>
        <th class="!p-2 md:p-4 text-center">Proveedor</th>
				<th class="!p-2 md:p-4 text-center">Descripción</th>
				<th class="!p-2 md:p-4 text-center flex justify-center gap-x-1" use:popup={popupHover}>
            Es Porcentual?
            <svg width="16" height="16" viewBox="0 0 48 48">
              <g fill="none">
                <path fill="#0672E5" stroke="#000" stroke-linejoin="round" stroke-width="4" d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z" />
                <path fill="#fff" fill-rule="evenodd" d="M24 11C25.3807 11 26.5 12.1193 26.5 13.5C26.5 14.8807 25.3807 16 24 16C22.6193 16 21.5 14.8807 21.5 13.5C21.5 12.1193 22.6193 11 24 11Z" clip-rule="evenodd" />
                <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M24.5 34V20H23.5H22.5" />
                <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M21 34H28" />
              </g>
            </svg>
        </th>
        <th/>
			</tr>
		</thead>
		<tbody>
      {#each $fixedBillsStore.data as fixedBill}
        <tr class="">
          <td class="!p-2 md:p-4 text-center !align-middle !text-lg">{fixedBill.vendor}</td>
          <td class="!p-2 md:p-4 text-center !align-middle !text-lg">{fixedBill.description}</td>
          <td class="!p-2 md:p-4 flex justify-center">
            <!-- <SlideToggle name="is_percentage" active="bg-primary-500" size="sm" checked={fixedBill.is_percentage} disabled /> -->
            {#if fixedBill.is_percentage}
            <svg class="h-8 text-success-500" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z" />
            </svg>
            {:else}
            <svg class="h-8 text-error-500" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z" />
            </svg>
            {/if}
          </td>
          <td>
            <div class="flex flex-row gap-x-2 justify-center">
              <button  on:click={() => triggerEditModal(fixedBill)}><svg class="h-8" viewBox="0 0 24 24">
                <path fill="currentColor" d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z" />
              </svg></button>
              <button on:click={() => triggerDeleteModal(fixedBill.id)}>
                <svg class="h-8" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zM7 6h10v13H7zm2 2v9h2V8zm4 0v9h2V8z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
			{/each}
		</tbody>
	</table>
</div>
{/if}

<div class="!m-0 card p-4 variant-glass-secondary w-[240px]" data-popup="popupHover">
	<p><b>Porcentual:</b> se dividirá segun el porcentaje de m2 de cada residente.</p>
  <p>Si no, se dividirá igualmente para cada residente.</p>
</div>