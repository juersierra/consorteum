<script lang="ts">
	import { getDrawerStore } from "@skeletonlabs/skeleton";

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
			drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a on:click={drawerClose} href="/dashboard">Dashboard</a></li>
		<li><a on:click={drawerClose} href="/about">About</a></li>
		<li><a on:click={drawerClose} href="/blog">Blog</a></li>
		<li><a on:click={drawerClose} href="/contact">Contact</a></li>
	</ul>
</nav>