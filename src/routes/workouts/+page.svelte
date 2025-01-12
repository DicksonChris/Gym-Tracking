<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loadWorkouts, workoutsStore, removeWorkout } from '$lib/stores/workoutsStore';
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
		<li class="card bg-base-100">
			<!-- Workout Title -->
			<div
				class="card flex flex-row items-center justify-between rounded-b-none border-b-[1px] border-primary p-2 text-white"
			>
				<h2 class="card-title ml-2 flex-grow text-2xl">{workout.groupName}</h2>
				<button on:click={() => handleEditClick(workout.id)} aria-label="Edit workout">
					<Icon icon="bi:three-dots-vertical" class="h-6 w-6" />
				</button>
				<button
					on:click={() => handleDeleteClick(workout.id)}
					aria-label="Delete workout"
					class="ml-2"
				>
					<Icon
						icon="bi:x"
						class="btn btn-circle btn-ghost btn-sm h-6 w-8 hover:btn-error hover:bg-error hover:text-base-content"
					/>
				</button>
			</div>
			<!-- Workout Exercises -->
			<ul class="card rounded-t-none pb-4 pt-2">
				{#if workout.exercises}
					<!-- Header row -->
					<div class="grid grid-cols-[3fr_1fr_1fr] border-b border-base-content px-4 py-2 font-semibold">
						<div>Name</div>
						<div>Tags</div>
						<div>Reps</div>
					</div>

					{#each workout.exercises as exerciseID}
						{#each allExercises as exercise}
							{#if exercise.id === exerciseID}
									<li class="grid grid-cols-[3fr_1fr_1fr] items-center gap-2 border-b border-base-content/10 px-4 py-2">
										<!-- Name column with ellipsis -->
										<div class="font-bold text-base-content whitespace-nowrap overflow-hidden text-ellipsis">
											{exercise.name}
										</div>

										<!-- Muscle Groups -->
										<div class="flex flex-wrap gap-1 overflow-hidden">
											{#each exercise.muscleGroup.split(',') as muscleGroup}
												<p class="badge badge-accent badge-xs text-nowrap overflow-hidden">{muscleGroup}</p>
											{/each}
										</div>

										{#if exercise.defaultReps}
											<div class="text-sm text-white overflow-hidden">{exercise.defaultReps} reps</div>
										{/if}
									</li>
							{/if}
						{/each}
					{/each}
				{/if}
			</ul>
		</li>
	{/each}
</ul>

<button
	aria-label="Create workout"
	title="Create workout"
	class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
	on:click={handleCreateClick}
>
	<Icon icon="bi:plus-lg" class="h-6 w-6" />
</button>