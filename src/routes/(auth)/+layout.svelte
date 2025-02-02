<script lang="ts">
	import NavAuth from '$lib/components/Header/NavAuth.svelte';
	let { data, children } = $props();
</script>

<header class="fixed top-0 left-0 z-10 flex w-full justify-between bg-primary p-4">
	<NavAuth />
</header>
<main class="container mx-auto p-2 pt-20">
	{@render children()}
</main>
