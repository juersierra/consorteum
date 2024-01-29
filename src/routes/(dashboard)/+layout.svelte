<script lang="ts">
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
</script>

<div>
    <header>
        <button on:click={() => {}}>
            <svg class="w-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="m17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5z" />
            </svg>
        </button>
    </header>
    header
    <slot/>
    footer
</div>