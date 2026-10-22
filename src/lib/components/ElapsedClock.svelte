<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fmtElapsed } from '$lib/sessionClient';

	export let startedAt: string;

	let now = Date.now();
	const tick = setInterval(() => (now = Date.now()), 1000);
	onDestroy(() => clearInterval(tick));
</script>

<span class="font-mono tabular-nums">{fmtElapsed(now - new Date(startedAt).getTime())}</span>
