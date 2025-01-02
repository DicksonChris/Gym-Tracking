<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { workoutsStore } from '$lib/stores/workoutsStore';
	import { type Exercise } from '$lib/api/exercises';
	import Title from '$lib/components/Title.svelte';
	import Icon from '@iconify/svelte';
	export let data;

	let { allExercises } = data;

	let workouts = [];

	$: workouts = $workoutsStore ?? [];

	function handleClick(workoutID: string) {
		goto(`/workouts/${workoutID}`);
	}

	function handleCreateClick() {
		goto('/workouts/new');
	}
</script>

<Title title="Workouts" />

<button on:click={handleCreateClick} class="btn btn-primary mb-4">
    Create New Workout
</button>

<ul class="grid gap-6">
	<!-- Workouts List -->
	{#each workouts as workout}
		<li class="card">
			<!-- Workout Title -->
			<button
				on:click={() => handleClick(workout.id)}
				aria-label="Edit workout"
				class="card flex flex-row items-center justify-between bg-secondary p-2 rounded-b-none"
			>
				<h2 class="card-title ml-2 text-2xl text-black">{workout.groupName}</h2>
				<Icon icon="bi:three-dots-vertical" class="h-6 w-8 text-black" />
			</button>
			<!-- Workout Exercises -->
			<ul class="card bg-secondary rounded-t-none pb-4">
				{#if workout.exercises}
					{#each workout.exercises as exerciseID}
						{#each allExercises as exercise}
							{#if exercise.id === exerciseID}
									<li class="ml-4 text-primary-content text-md">{exercise.name}</li>
							{/if}
						{/each}
					{/each}
				{/if}
			</ul>
		</li>
	{/each}
</ul>
