<script lang="ts">
	/** @type {import('./$types').PageProps} */
	export let data; 

	import HistoryForm from '$lib/components/HistoryForm.svelte';

	const { exercise, lastHistory } = data;
</script>

{#if exercise}
    <HistoryForm {exercise} lastHistory={lastHistory} />
{:else}
    <p>No exercise found or access denied.</p>
{/if}