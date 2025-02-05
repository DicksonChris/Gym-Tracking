<script lang="ts">
	/** @type {import('./$types').PageProps} */
	export let data;

	import HistoryForm from '$lib/components/HistoryForm.svelte';

	const { exercise, history } = data;
</script>

{#if exercise && history}
	<!-- We pass initialData so the form can populate fields.
	     The form will do a POST with method="POST" to the default action 
	     that updates the existing record. 
	-->
	<HistoryForm {exercise} initialData={history} />
{/if}

{#if !exercise}
	<p>Exercise not found</p>
{/if}
{#if exercise && !history}
	<p>History record not found</p>
{/if}
