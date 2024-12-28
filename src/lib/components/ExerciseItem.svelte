<script lang="ts">
	import { onMount } from 'svelte';
	import { getExercise, type Exercise } from '$lib/api/exercises';
	import HistoryList from '$lib/components/HistoryList.svelte';
	export let exerciseID: string;

	let exercise: Exercise | null = null;

	onMount(async () => {
		exercise = await getExercise(exerciseID);
	});
</script>

<div class="exercise">
	{#if exercise}
		<!-- <pre>{JSON.stringify(exercise, null, 2)}</pre> -->
		<h2>{exercise.name}</h2>
		<p>Muscle Group: {exercise.muscleGroup}</p>
		{#if exercise.measurement && exercise.measurement.length > 0}
			<ul>
				{#each exercise.measurement as measurement}
					<li>{measurement}</li>
				{/each}
			</ul>
			<HistoryList exerciseID={exerciseID} />
		{:else}
			No measurement
		{/if}

		<p>Hidden: {exercise.hidden ? 'Yes' : 'No'}</p>
	{:else}
		<p>Loading...</p>
	{/if}
</div>
<br/>