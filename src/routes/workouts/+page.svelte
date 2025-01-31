<!-- src/routes/workouts/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	// Data from +page.server.ts:
	export let data;

	// Extract "allExercises" and "workouts" from SSR
	let { allExercises, workouts } = data;

	function handleEditClick(workoutID: string) {
		goto(`/workouts/${workoutID}`);
	}

	function handleCreateClick() {
		goto('/workouts/new');
	}

	async function handleDeleteClick(workoutID: string) {
		const confirmDelete = confirm('Are you sure?');
		if (!confirmDelete) return;
		try {
			await fetch(`/api/workouts/${workoutID}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			workouts = workouts.filter((w) => w.id !== workoutID);
		} catch (err) {
			console.error('Delete error:', err);
		}
	}
</script>

<!-- Render the list of workouts -->
<ul class="grid gap-6">
	{#each workouts as workout}
		<li class="card bg-base-100">
			<!-- Header with groupName and edit/delete buttons -->
			<div
				class="card flex flex-row items-center justify-between rounded-b-none border-b-[1px] border-primary p-2 text-white"
			>
				<h2 class="card-title ml-2 flex-grow text-2xl">{workout.groupName}</h2>

				<!-- Edit button -->
				<button on:click={() => handleEditClick(workout.id)} aria-label="Edit workout">
					<Icon icon="bi:three-dots-vertical" class="h-6 w-6" />
				</button>

				<!-- Delete button -->
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

			<!-- Exercises within this workout -->
			<ul class="card rounded-t-none pb-4 pt-2">
				{#if workout.exercises}
					<!-- Header row for exercises -->
					<div
						class="grid grid-cols-[3fr_1fr_1fr] border-b border-base-content px-4 py-2 font-semibold"
					>
						<div>Name</div>
						<div>Tags</div>
						<div>Reps</div>
					</div>

					<!-- For each exercise ID in the workout, find matching exercise in allExercises -->
					{#each workout.exercises as exerciseID}
						{#each allExercises as exercise}
							{#if exercise.id === exerciseID}
								<li
									class="grid grid-cols-[3fr_1fr_1fr] items-center gap-2 border-b border-base-content/10 px-4 py-2"
								>
									<!-- Name column -->
									<div
										class="overflow-hidden text-ellipsis whitespace-nowrap font-bold text-base-content"
									>
										{exercise.name}
									</div>
									<!-- Tags / muscle groups -->
									<div class="flex flex-wrap gap-1 overflow-hidden">
										{#each exercise.muscleGroup.split(',') as muscleGroup}
											<p class="badge badge-accent badge-xs">{muscleGroup}</p>
										{/each}
									</div>
									<!-- Reps -->
									{#if exercise.defaultReps}
										<div class="overflow-hidden text-sm text-white">
											{exercise.defaultReps} reps
										</div>
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

<!-- Button to create a new workout -->
<button
	aria-label="Create workout"
	title="Create workout"
	class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
	on:click={handleCreateClick}
>
	<Icon icon="bi:plus-lg" class="h-6 w-6" />
</button>
