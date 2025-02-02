<!-- src/routes/workouts/[workoutID]/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import Title from '$lib/components/Title.svelte';
	import DnDList from '$lib/components/DnDList.svelte';
	import type { Exercise } from '$lib/api/exercises';
	import type { Workout } from '$lib/api/workouts';

	// These come from +page.server.ts
	export let data;

	let { workoutID, workout, workoutExercises, allExercises } = data;

	// Are we editing groupName inline or not
	let editingGroupName = (workoutID === 'new');

	function handleAllUpdate(e: CustomEvent<{ exercises: Exercise[] }>) {
		allExercises = e.detail.exercises;
	}

	function handleWorkoutUpdate(e: CustomEvent<{ exercises: Exercise[] }>) {
		workoutExercises = e.detail.exercises;
	}

	function toggleEditGroupName() {
		editingGroupName = !editingGroupName;
	}

	function handleGroupNameBlur(e: FocusEvent) {
		const input = e.target as HTMLInputElement;
		workout.groupName = input.value;
	}

	async function handleUpdateWorkoutName() {
		// If not "new", optionally do a partial update here. Or just wait until final "Submit".
		if (workoutID !== 'new') {
			try {
				await fetch('/api/workouts', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({
						id: workout.id,
						groupName: workout.groupName,
						exercises: workout.exercises
					})
				});
				editingGroupName = false;
			} catch (error) {
				console.error('Failed to update workout name:', error);
				alert('Error: ' + error);
			}
		} else {
			// For a new workout, we just close editing
			editingGroupName = false;
		}
	}

	async function handleSubmit() {
		// gather final data
		const updatedExercises = workoutExercises.map((x) => x.id);
		const body = {
			id: workoutID,
			groupName: workout.groupName,
			exercises: updatedExercises
		};

		try {
			// call /api/workouts to create or update
			await fetch('/api/workouts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(body)
			});

			goto('/app/workouts'); // or wherever
		} catch (error) {
			console.error('Failed to update workout:', error);
			alert('Error: ' + error);
		}
	}
</script>

{#if workout}
	<Title title={workoutID === 'new' ? 'Create Workout' : 'Edit Workout'} />

	<div class="card mb-4 flex flex-row items-center justify-between bg-base-100 p-2">
		{#if editingGroupName}
			<!-- inline editing groupName -->
			<input
				type="text"
				class="input input-bordered flex-grow text-black bg-white"
				bind:value={workout.groupName}
				on:blur={handleGroupNameBlur}
				autofocus
			/>
		{:else}
			<h2 id="groupName" class="card-title ml-2 flex-grow text-2xl text-white">
				{workout.groupName}
			</h2>
		{/if}

		{#if editingGroupName}
			<!-- if "new", show a check; if existing, show a "save" icon -->
			<button
				on:click={handleUpdateWorkoutName}
				aria-label={workoutID === 'new' ? 'Confirm workout name' : 'Update workout name'}
				class="btn btn-ghost btn-secondary btn-sm"
			>
				<Icon icon={workoutID === 'new' ? 'bi:check' : 'bi:floppy'} class="h-6 w-6 text-base-content" />
			</button>
		{:else}
			<button
				on:click={toggleEditGroupName}
				aria-label="Edit workout name"
				class="btn btn-ghost btn-secondary btn-sm"
			>
				<Icon icon="bi:pencil" class="h-6 w-6 text-base-content" />
			</button>
		{/if}
	</div>

	<div class="grid grid-cols-2 gap-1">
		<!-- All Exercises (not in workout) -->
		<div id="all-exercises" class="flex h-full flex-col rounded border p-1 shadow">
			<h2 class="mb-2 text-center text-xl font-semibold uppercase text-white">Available</h2>
			<DnDList exercises={allExercises} type="exercise" on:update={handleAllUpdate} />
		</div>

		<!-- Workout Exercises -->
		<div id="workout-exercises" class="flex h-full flex-col rounded border p-1 shadow">
			<h2 class="mb-2 text-center text-xl font-semibold uppercase text-white">Selected</h2>
			<DnDList exercises={workoutExercises} type="exercise" on:update={handleWorkoutUpdate} />
		</div>
	</div>

	<button
		class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
		on:click={handleSubmit}
	>
		<Icon icon="bi:check2" class="h-6 w-6" />
	</button>
{:else}
	<!-- If no workout found or user not logged in, show message -->
	<p class="text-error">No workout data.</p>
{/if}
