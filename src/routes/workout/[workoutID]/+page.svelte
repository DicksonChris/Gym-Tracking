<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { type Workout } from '$lib/api/workouts';
	import { getExercise, getExercises, type Exercise } from '$lib/api/exercises';
	import { workoutsStore, loadWorkoutExercises, saveWorkout } from '$lib/stores/workoutsStore';
	import DnDList from '$lib/components/DnDList.svelte';
	import Icon from '@iconify/svelte';
	import Title from '$lib/components/Title.svelte';
	export let data;

	let { workout, workoutExercises, allExercises } = data;

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

<Title title="Edit Workout" />
{#if workout}
	<div
		class="card mb-4 flex flex-row items-center justify-between bg-secondary p-2"
	>
		<h2 class="card-title ml-2 text-2xl text-black">{workout.groupName}</h2>
	</div>
	<div class="grid grid-cols-2 gap-6">
		<!-- All Exercises -->
		<div class="rounded border p-4 shadow">
			<h2 class="mb-4 text-center text-2xl font-semibold">All Exercises</h2>
			<DnDList exercises={allExercises} type="exercise" on:update={handleAllUpdate} />
		</div>

		<!-- Workout Exercises -->
		<div class="rounded border p-4 shadow">
			<h2 class="mb-4 text-center text-2xl font-semibold">Workout Exercises</h2>
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
