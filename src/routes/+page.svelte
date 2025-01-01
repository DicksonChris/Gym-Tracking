<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { workoutsStore, loadWorkouts } from '$lib/stores/workoutsStore';
	import ExerciseItem from '$lib/components/ExerciseItem.svelte';
	import Icon from '@iconify/svelte';

	function handleClick(workoutID: string) {
		goto(`/workout/${workoutID}`);
	}

	let workouts = [];

	$: workouts = $workoutsStore ?? [];

	onMount(async () => {
		await loadWorkouts();
	});
</script>

<h1 class="mb-4 text-center text-4xl font-bold">Workouts</h1>
<ul class="space-y-6">
	<!-- Workouts List -->
	{#each workouts as workout}
		<li class="card mb-12">
			<!-- Workout Title -->
			<button on:click={() => handleClick(workout.id)} aria-label="Edit workout" class="card mb-4 flex flex-row justify-between items-center bg-secondary p-2">
				<h2 class="card-title ml-2 text-2xl text-black">{workout.groupName}</h2>
				<Icon icon="bi:three-dots-vertical" class="h-6 w-8 text-black" />
			</button>
			<!-- Workout Exercises -->
			<ul class="space-y-4">
				{#if workout.exercises}
					{#each workout.exercises as exerciseID}
						<ExerciseItem {exerciseID} />
					{/each}
				{/if}
			</ul>
		</li>
	{/each}
</ul>
