<script lang="ts">
	import { goto } from '$app/navigation';
	import { type Workout } from '$lib/api/workouts';
	import { type Exercise } from '$lib/api/exercises';
	import { createNewWorkout, saveWorkout } from '$lib/stores/workoutsStore';
	import DnDList from '$lib/components/DnDList.svelte';
	import Icon from '@iconify/svelte';
	import Title from '$lib/components/Title.svelte';
	export let data;

	let { workoutID, workout, workoutExercises, allExercises } = data;

	function handleAllUpdate(e: CustomEvent<{ exercises: Exercise[] }>) {
		allExercises = e.detail.exercises;
	}

	function handleWorkoutUpdate(e: CustomEvent<{ exercises: Exercise[] }>) {
		workoutExercises = e.detail.exercises;
	}

	function handleGroupNameChange(e: Event) {
		// TODO, no input yet
		const target = e.target as HTMLInputElement;
		workout.groupName = target.value;
	}

	async function handleSubmit() {
		const updated: Partial<Workout> = { exercises: workoutExercises.map((x) => x.id) };
		try {
			if (workoutID === 'new') {
				await createNewWorkout({ ...workout, ...updated });
			} else {
				await saveWorkout(workout.id, updated);
			}
			goto('/');
		} catch (error) {
			console.error('Failed to update workout:', error);
			alert('Error: ' + error);
		}
	}
</script>

{#if workout}
	{#if workoutID === 'new'}
		<Title title="Create Workout" />
		<div class="card mb-4 flex flex-row items-center justify-between bg-secondary p-2">
			<!-- input workoutName -->

			<input
				type="text"
				placeholder="Workout Name"
				class="input input-bordered input-primary"
				bind:value={workout.groupName}
			/>
		</div>
	{:else}
		<Title title="Edit Workout" />
		<div class="card mb-4 flex flex-row items-center justify-between bg-secondary p-2">
			<h2 class="card-title ml-2 flex-grow text-2xl text-black">{workout.groupName}</h2>
			<button
				on:click={handleGroupNameChange}
				aria-label="Edit workout name"
				class="btn btn-ghost btn-secondary btn-sm"
			>
				<Icon icon="bi:pencil" class="h-6 w-6 text-black" />
			</button>
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-1">
		<!-- All Exercises -->
		<div id="all-exercises" class="flex h-full flex-col rounded border p-1 shadow">
			<h2 class="mb-2 text-center text-xl font-semibold uppercase">Available</h2>
			<DnDList exercises={allExercises} type="exercise" on:update={handleAllUpdate} />
		</div>

		<!-- Workout Exercises -->
		<div id="workout-exercises" class="flex h-full flex-col rounded border p-1 shadow">
			<h2 class="mb-2 text-center text-xl font-semibold uppercase">Selected</h2>
			<DnDList exercises={workoutExercises} type="exercise" on:update={handleWorkoutUpdate} />
		</div>
	</div>
	<button
		class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
		on:click={handleSubmit}
	>
		<Icon icon="bi:check2" class="h-6 w-6" />
	</button>
{/if}
