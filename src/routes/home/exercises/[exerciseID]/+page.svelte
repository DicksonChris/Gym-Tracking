<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import Title from '$lib/components/Title.svelte';
	import type { Exercise } from '$lib/api/exercises';
	import Counter from '$lib/components/Counter.svelte';

	/** SSR data from +page.server.ts */
	export let data;

	let { exerciseID, exercise, muscleGroups } = data;

	// If there's no exercise, we might be "new" or load failed
	let exerciseName: string = exercise ? exercise.name : '';
	let selectedMuscleGroups: string[] = exercise
		? (exercise.muscleGroup || '').split(',').map((g) => g.trim())
		: [];
	let newMuscleGroup = '';

	let selectedMeasurements: string[] = exercise ? (exercise.measurement || []) : [];
	let defaultReps: number = exercise?.defaultReps ?? 0;
	let defaultStep: number = exercise?.defaultStep ?? 0;
	let editingExerciseName = (exerciseID === 'new');

	/** 
	 * For inline editing of exercise name 
	 */
	function toggleEditExerciseName() {
		editingExerciseName = !editingExerciseName;
	}
	function handleExerciseNameBlur(e: FocusEvent) {
		exerciseName = (e.target as HTMLInputElement).value;
	}

	/**
	 * If not "new," do a partial update of just the name field
	 */
	async function handleUpdateExerciseName() {
		if (exerciseID !== 'new' && exercise) {
			try {
				await fetch('/api/exercises', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({
						id: exercise.id,
						name: exerciseName.trim()
					})
				});
				editingExerciseName = false;
			} catch (err) {
				console.error('Error updating exercise name:', err);
				alert('Failed to update exercise name.');
			}
		} else {
			// if "new", do nothing
			editingExerciseName = false;
		}
	}

	/**
	 * Final submission, either creating or updating the exercise fully
	 */
	async function handleSubmit() {
		if (!exerciseName.trim()) {
			alert('Exercise name is required.');
			return;
		}

		const exerciseData: Partial<Exercise> = {
			name: exerciseName.trim(),
			muscleGroup: selectedMuscleGroups.join(', '),
			measurement: selectedMeasurements
		};

		if (selectedMeasurements.includes('reps')) {
			exerciseData.defaultReps = Math.round(defaultReps);
		}
		if (selectedMeasurements.includes('weight')) {
			exerciseData.defaultStep = parseFloat(defaultStep.toFixed(1));
		}

		try {
			await fetch('/api/exercises', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					id: exerciseID === 'new' ? 'new' : exerciseID,
					...exerciseData
				})
			});
			goto('/home/exercises');
		} catch (err) {
			console.error('Error saving exercise:', err);
			alert('Failed to save exercise.');
		}
	}

	function addNewMuscleGroup() {
		const group = newMuscleGroup.trim();
		if (group && !muscleGroups.includes(group)) {
			muscleGroups = [...muscleGroups, group];
			selectedMuscleGroups = [...selectedMuscleGroups, group];
			newMuscleGroup = '';
		}
	}

	function toggleMuscleGroup(group: string) {
		if (selectedMuscleGroups.includes(group)) {
			selectedMuscleGroups = selectedMuscleGroups.filter((g) => g !== group);
		} else {
			selectedMuscleGroups = [...selectedMuscleGroups, group];
		}
	}
</script>

<!-- Render the page if we have exercise info or it's "new" -->
{#if exerciseID === 'new' || exercise}
	<Title title={exerciseID === 'new' ? 'Create New Exercise' : 'Edit Exercise'} />

	<div class="card mb-4 flex flex-row items-center justify-between bg-base-100 p-2">
		{#if editingExerciseName}
			<input
				type="text"
				class="input input-bordered bg-white text-black flex-grow"
				bind:value={exerciseName}
				on:blur={handleExerciseNameBlur}
				autofocus
			/>
		{:else}
			<h2 class="card-title ml-2 flex-grow text-2xl text-white">{exerciseName}</h2>
		{/if}

		{#if editingExerciseName}
			<!-- If "new," show check icon, else show 'save' icon -->
			<button
				on:click={handleUpdateExerciseName}
				class="btn btn-ghost btn-secondary btn-sm text-base-content"
			>
				<Icon icon={exerciseID === 'new' ? 'bi:check2' : 'bi:floppy'} class="h-6 w-6" />
			</button>
		{:else}
			<button
				on:click={toggleEditExerciseName}
				aria-label="Edit exercise name"
				class="btn btn-ghost btn-secondary btn-sm"
			>
				<Icon icon="bi:pencil" class="h-6 w-6 text-base-content" />
			</button>
		{/if}
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<!-- Add New Muscle Group -->
		<div class="flex items-center">
			<input
				type="text"
				bind:value={newMuscleGroup}
				placeholder="Enter new muscle group"
				class="input input-bordered w-full rounded-r-none text-base-content"
			/>
			<button type="button" on:click={addNewMuscleGroup} class="btn btn-primary rounded-l-none">
				<Icon icon="bi:check2" class="h-6 w-6" />
			</button>
		</div>

		<!-- Existing Muscle Groups -->
		<div>
			<h2 class="text-lg font-semibold mb-2">Add Tag</h2>
			<div class="flex select-none flex-wrap gap-2 mb-2">
				{#each muscleGroups as group}
					<span
						class="badge cursor-pointer transition-colors
							{selectedMuscleGroups.includes(group)
								? 'badge-accent'
								: 'badge-outline text-neutral-content'}"
						on:click={() => toggleMuscleGroup(group)}
					>
						{group}
					</span>
				{/each}
			</div>
		</div>

		<!-- Chosen muscle groups -->
		<div>
			<h3 class="text-md font-semibold mb-2">Selected Tags:</h3>
			<div class="flex flex-wrap gap-2 bg-base-300 p-2 rounded">
				{#each selectedMuscleGroups as mg}
					<span class="badge badge-accent">
						{mg}
						<button
							type="button"
							on:click={() => (selectedMuscleGroups = selectedMuscleGroups.filter((m) => m !== mg))}
							class="ml-1"
						>
							<Icon icon="bi:x" class="h-4 w-4" />
						</button>
					</span>
				{/each}
			</div>
		</div>

		<!-- Measurement checkboxes + counters -->
		<div>
			<h2 class="text-lg font-semibold">Measurements</h2>
			<div class="flex flex-col gap-2">
				<label class="flex items-center">
					<input type="checkbox" bind:group={selectedMeasurements} value="reps" class="checkbox" />
					<span class="ml-2">Reps</span>
				</label>
				{#if selectedMeasurements.includes('reps')}
					<div class="ml-6">
						<label class="label">Default Reps</label>
						<Counter bind:value={defaultReps} min={0} step={1} decimal={false} />
					</div>
				{/if}

				<label class="flex items-center">
					<input type="checkbox" bind:group={selectedMeasurements} value="weight" class="checkbox" />
					<span class="ml-2">Weight</span>
				</label>
				{#if selectedMeasurements.includes('weight')}
					<div class="ml-6">
						<label class="label">Default Step (lbs)</label>
						<Counter bind:value={defaultStep} step={0.5} min={0} decimal={true} />
					</div>
				{/if}

				<label class="flex items-center">
					<input type="checkbox" bind:group={selectedMeasurements} value="time" class="checkbox" />
					<span class="ml-2">Time</span>
				</label>

				<label class="flex items-center">
					<input type="checkbox" bind:group={selectedMeasurements} value="distance" class="checkbox" />
					<span class="ml-2">Distance</span>
				</label>
			</div>
		</div>

		<!-- Submit Button -->
		<button
			type="submit"
			class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
		>
			<Icon icon="bi:check2" class="h-6 w-6" />
		</button>
	</form>
{:else}
	<p class="text-error">No exercise found or not authorized.</p>
{/if}

<style>
	.badge:hover {
		opacity: 0.8;
	}
</style>