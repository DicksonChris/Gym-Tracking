<!-- display all exercises -->
<script lang="ts">
	import { onMount } from 'svelte';
	import {
		showHidden,
		hideExercise,
		unhideExercise,
		getExercises,
		type Exercise
	} from '$lib/api/exercises';

	let exercises: Exercise[] = [];
	onMount(async () => {
		exercises = await getExercises();
	});
</script>

<main class="container mx-auto p-8">
	<h1 class="mb-4 text-center text-4xl font-bold">Exercises</h1>
	<!-- toggle showHidden boolean -->
	<button on:click={showHidden}>Show Hidden: {showHidden}</button>
	<br />
	<br />
	<!-- Print exercises to screen from api -->
	{#each exercises as exercise}
		<h2>{exercise.name}</h2>
		<p>Muscle Group: {exercise.muscleGroup}</p>
		{#if exercise.measurement && exercise.measurement.length > 0}
			<ul>
				{#each exercise.measurement as measurement}
					<li>{measurement}</li>
				{/each}
			</ul>
		{:else}
			No measurement
		{/if}
		<p>
			Hidden:
			{#if exercise.hidden}
				<button on:click={() => unhideExercise(exercise.id)}>{exercise.hidden}</button>
			{:else}
				<button on:click={() => hideExercise(exercise.id)}>{exercise.hidden}</button>
			{/if}
		</p>
		<br />
	{/each}
</main>
