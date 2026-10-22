<script lang="ts">
	import SetLogger from '$lib/components/SetLogger.svelte';

	export let data;

	$: ({ exercise, histories, nextExercise, activeSession } = data);
</script>

{#if exercise}
	<!-- keyed so moving to the next exercise re-initializes the form -->
	{#key exercise.id}
		<SetLogger {exercise} {histories} session={activeSession} {nextExercise} />
	{/key}
{:else}
	<p>No exercise found or access denied.</p>
{/if}