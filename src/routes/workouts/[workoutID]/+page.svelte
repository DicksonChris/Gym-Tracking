<script lang="ts">
	import { goto } from '$app/navigation';
	import { type Workout } from '$lib/api/workouts';
	import { type Exercise } from '$lib/api/exercises';
	import { saveWorkout } from '$lib/stores/workoutsStore';
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

	async function handleSubmit() {
		const updated: Partial<Workout> = { exercises: workoutExercises.map((x) => x.id) };
		try {
			if (!workout) return;
			saveWorkout(workout.id, updated);
			goto('/');
		} catch (error) {
			console.error('Failed to update workout:', error);
			alert('There was an error updating the workout. Please try again.');
		}
	}
</script>

{#if workout}
{#if workoutID === 'new'}
<Title title="Create Workout" />
<div
		class="card mb-4 flex flex-row items-center justify-between bg-secondary p-2"
	>
		<!-- input workoutName -->
		<input
			type="text"
			placeholder="Workout Name"
			class="input input-primary input-bordered w-full"
			bind:value={workout.groupName}
		/>
	</div>
{:else}
<Title title="Edit Workout" />
<div
		class="card mb-4 flex flex-row items-center justify-between bg-secondary p-2"
	>
		<h2 class="card-title ml-2 text-2xl text-black">{workout.groupName}</h2>
	</div>
{/if}
	
	<div  class="grid grid-cols-2 gap-1">
		<!-- All Exercises -->
		<div id="all-exercises" class="rounded p-1 border shadow h-full flex flex-col">
			<h2 class="mb-2 text-center text-xl font-semibold uppercase">Available</h2>
			<DnDList exercises={allExercises} type="exercise" on:update={handleAllUpdate} />
		</div>

		<!-- Workout Exercises -->
		<div id="workout-exercises" class="rounded p-1 border shadow h-full flex flex-col">
			<h2 class="mb-2 text-center text-xl font-semibold uppercase">Selected</h2>
			<DnDList exercises={workoutExercises} type="exercise" on:update={handleWorkoutUpdate} />
		</div>
	</div>
	<button
			class="btn btn-lg btn-circle btn-primary hover:btn-neutral hover:text-primary fixed bottom-4 right-4"
			on:click={handleSubmit}
		>
			<Icon icon="bi:check2" class="w-6 h-6" />
		</button>
{/if}
