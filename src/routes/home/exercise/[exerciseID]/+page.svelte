<script lang="ts">
	import SetLogger from '$lib/components/SetLogger.svelte';

	export let data;

	$: ({ exercise, histories } = data);
</script>

{#if exercise}
	<SetLogger {exercise} {histories} />
{:else}
	<p>No exercise found or access denied.</p>
{/if}
