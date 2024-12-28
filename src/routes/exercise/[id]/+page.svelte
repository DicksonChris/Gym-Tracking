<script lang="ts">
	import { getExercise, type Exercise } from '$lib/api/exercises.js';
	import { createHistory, type History } from '$lib/api/history.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data;

	const exerciseID = data.slug;

	let exercise: Exercise;

	let reps: number;
	let weight: number;
	let distance: string;
	let time: string;

	const historyData: History = {
		exercise: exerciseID,
		startTime: new Date().toISOString(),
		reps: 0,
		weight: 0,
		distance: '',
		time: ''
	};

	function handleSubmit() {
		const historyData: Partial<History> = {
			exercise: exerciseID,
			startTime: new Date().toISOString(),
			reps: reps,
			weight: weight,
			distance: distance,
			time: time
		};
		createHistory(historyData).then(() => {
			goto(`/`);
		});
	}

	onMount(async () => {
		exercise = await getExercise(exerciseID);
	});
</script>

{#if exercise}
	<h1>{exercise.name}</h1>
	<p>{exercise.muscleGroup}</p>
	{#each exercise.measurement ?? [] as measurement}
		<p>{measurement}</p>
	{/each}
	<form class="form-control" on:submit|preventDefault={handleSubmit}>
		{#if exercise.measurement?.includes('reps')}
			<div class="form-control">
				<label class="label" for="reps">Reps</label>
				<input
					class="input input-bordered"
					type="number"
					id="reps"
					name="reps"
					bind:value={reps}
					required
				/>
			</div>
		{/if}

		{#if exercise.measurement?.includes('weight')}
			<div class="form-control">
				<label class="label" for="weight">Weight</label>
				<input
					class="input input-bordered"
					type="number"
					id="weight"
					name="weight"
					bind:value={weight}
					required
				/>
			</div>
		{/if}

		{#if exercise.measurement?.includes('distance')}
			<div class="form-control">
				<label class="label" for="distance">Distance</label>
				<input
					class="input input-bordered"
					type="text"
					id="distance"
					name="distance"
					bind:value={distance}
					required
				/>
			</div>
		{/if}

		{#if exercise.measurement?.includes('time')}
			<div class="form-control">
				<label class="label" for="time">Time</label>
				<input
					class="input input-bordered"
					type="text"
					id="time"
					name="time"
					bind:value={time}
					required
				/>
			</div>
		{/if}

		<button class="btn btn-primary mt-4" type="submit">Submit</button>
	</form>
{/if}
