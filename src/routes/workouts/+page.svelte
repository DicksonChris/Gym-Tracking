<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loadWorkouts, workoutsStore, removeWorkout } from '$lib/stores/workoutsStore';
	import { type Exercise } from '$lib/api/exercises';
	import Title from '$lib/components/Title.svelte';
	import Icon from '@iconify/svelte';
	export let data;

	let { allExercises } = data;

	let workouts = [];

	$: workouts = $workoutsStore ?? [];

	function handleEditClick(workoutID: string) {
		goto(`/workouts/${workoutID}`);
	}

	function handleCreateClick() {
		goto('/workouts/new');
	}

	function handleDeleteClick(workoutID: string) {
		const confirmDelete = confirm('Are you sure you want to delete this workout?');
		if (confirmDelete) {
			removeWorkout(workoutID);
		}
	}

	onMount(async () => {
		await loadWorkouts();
	});
</script>

<ul class="grid gap-6">
	<!-- Workouts List -->
	{#each workouts as workout}
		<li class="card">
			<!-- Workout Title -->
			<div class="card flex flex-row items-center justify-between rounded-b-none p-2">
				<h2 class="card-title ml-2 flex-grow text-2xl text-black">{workout.groupName}</h2>
				<button on:click={() => handleEditClick(workout.id)} aria-label="Edit workout">
					<Icon icon="bi:three-dots-vertical" class="h-6 w-10 text-black" />
				</button>
				<button on:click={() => handleDeleteClick(workout.id)} aria-label="Delete workout">
					<Icon
						icon="bi:x"
						class="btn btn-circle btn-secondary btn-sm h-6 w-8 text-black hover:btn-error hover:text-base-content"
					/>
				</button>
			</div>
			<!-- Workout Exercises -->
			<ul class="card rounded-t-none bg-base-300 pb-4 pt-2">
				{#if workout.exercises}
					{#each workout.exercises as exerciseID}
						{#each allExercises as exercise}
							{#if exercise.id === exerciseID}
								<li class="text-md ml-4 text-base-content">{exercise.name}</li>
							{/if}
						{/each}
					{/each}
				{/if}
			</ul>
		</li>
	{/each}
</ul>

<button aria-label="Create workout" title="Create workout"
	class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
	on:click={handleCreateClick}
>
	<Icon icon="bi:plus-lg" class="h-6 w-6" />
</button>
