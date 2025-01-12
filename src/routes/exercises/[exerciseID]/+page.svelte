<script lang="ts">
	import { goto } from '$app/navigation';
	import { type Exercise } from '$lib/api/exercises';
	import Icon from '@iconify/svelte';
	import Title from '$lib/components/Title.svelte';
	import { createNewExercise, saveExercise, loadMuscleGroups } from '$lib/stores/exercisesStore';
	import { onMount } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import Counter from '$lib/components/Counter.svelte';
	import { get } from 'svelte/store';
	import { exercisesStore } from '$lib/stores/exercisesStore';

	export let data;

	let { exerciseID, exercise, muscleGroups } = data;
	let selectedMuscleGroups: string[] = exercise
		? exercise.muscleGroup.split(', ').map((g) => g.trim())
		: [];
	let newMuscleGroup: string = '';

	let exerciseName: string = exercise ? exercise.name : '';
	let selectedMeasurements: string[] = exercise ? exercise.measurement : [];

	// Initialize defaultReps and defaultStep as numbers, not nullable
	let defaultReps: number = exercise?.defaultReps ?? 0;
	let defaultStep: number = exercise?.defaultStep ?? 0;
	let editingExerciseName = exerciseID === 'new';

	// Transform strings into objects with an "id"
	let items = selectedMuscleGroups.map((name) => ({ id: name }));

	onMount(async () => {
		if (!muscleGroups || muscleGroups.length === 0) {
			muscleGroups = await loadMuscleGroups();
		}
	});

	// Reactive statements to reset defaults when measurements are deselected
	$: {
		if (selectedMeasurements.includes('reps')) {
			// Ensure defaultReps is initialized to 0 if it's currently less than the minimum
			if (defaultReps < 0) {
				defaultReps = exercise?.defaultReps ?? 0;
			}
		} else {
			// Reset to 0 to ensure Counter never receives null
			defaultReps = exercise?.defaultReps ?? 0;
		}

		if (selectedMeasurements.includes('weight')) {
			// Ensure defaultStep is initialized to 0 if it's currently less than the minimum
			if (defaultStep < 0) {
				defaultStep = exercise?.defaultStep ?? 0;
			}
		} else {
			// Reset to 0 to ensure Counter never receives null
			defaultStep = exercise?.defaultStep ?? 0;
		}
	}

	function syncItems() {
		items = selectedMuscleGroups.map((name) => ({ id: name }));
	}

	function addMuscleGroup(group: string) {
		if (!selectedMuscleGroups.includes(group)) {
			selectedMuscleGroups = [...selectedMuscleGroups, group];
			syncItems();
		}
	}

	function removeMuscleGroup(name: string) {
		selectedMuscleGroups = selectedMuscleGroups.filter((m) => m !== name);
		syncItems();
	}

	function addNewMuscleGroup() {
		const trimmedGroup = newMuscleGroup.trim();
		if (trimmedGroup && !muscleGroups.includes(trimmedGroup)) {
			muscleGroups = [...muscleGroups, trimmedGroup];
			selectedMuscleGroups = [...selectedMuscleGroups, trimmedGroup];
			syncItems();
			newMuscleGroup = '';
		}
	}

	function toggleMuscleGroup(group: string) {
		if (selectedMuscleGroups.includes(group)) {
			selectedMuscleGroups = selectedMuscleGroups.filter((g) => g !== group);
		} else {
			selectedMuscleGroups = [...selectedMuscleGroups, group];
		}
		syncItems();
	}

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
			if (exerciseID === 'new') {
				await createNewExercise(exerciseData);
			} else {
				exerciseData.id = exerciseID;
				await saveExercise(exerciseData as Partial<Exercise> & { id: string });
			}
			goto('/exercises');
		} catch (error) {
			console.error('Error saving exercise:', error);
			alert('Failed to save exercise.');
		}
	}

	function handleConsider(e) {
		items = e.detail.items;
		selectedMuscleGroups = items.map((i) => i.id);
	}

	function handleFinalize(e) {
		items = e.detail.items;
		selectedMuscleGroups = items.map((i) => i.id);
	}

	// Used to add hint border to draggable area when hovering over it
	let isBadgeHovered = false;
	function onHoverStart() {
		isBadgeHovered = true;
	}
	function onHoverEnd() {
		isBadgeHovered = false;
	}

	function toggleEditExerciseName() {
		editingExerciseName = !editingExerciseName;
	}

	function handleExerciseNameBlur(e: FocusEvent) {
		const target = e.target as HTMLInputElement;
		exerciseName = target.value;
	}

	async function handleUpdateExerciseName() {
		if (exerciseID !== 'new') {
			try {
				const exerciseData: Partial<Exercise> & { id: string } = { id: exerciseID, name: exerciseName.trim() };
				await saveExercise(exerciseData);
				editingExerciseName = false;
			} catch (error) {
				console.error('Error updating exercise name:', error);
				alert('Failed to update exercise name.');
			}
		} else {
			editingExerciseName = false;
		}
	}
</script>

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
			<button
				on:click={handleUpdateExerciseName}
				aria-label={exerciseID === 'new' ? 'Confirm exercise name' : 'Update exercise name'}
				class="btn btn-ghost btn-secondary btn-sm text-base-content"
			>
				<Icon icon={exerciseID === 'new' ? 'bi:check2' : 'bi:floppy'} class="h-6 w-6 text-base-content" />
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

		<!-- Available Muscle Groups Section -->
		<div>
			<h2 class="text-lg font-semibold mb-2">Add Tag</h2>
			<div class="flex select-none flex-wrap gap-2 mb-2">
				{#each muscleGroups as group}
					{#each group.split(',').map((g) => g.trim()) as individualGroup}
						<span
							class="badge cursor-pointer transition-colors 
								{selectedMuscleGroups.includes(individualGroup)
									? 'badge-accent'
									: 'badge-outline text-neutral-content'}"
							on:click={() => toggleMuscleGroup(individualGroup)}
						>
							{individualGroup}
						</span>
					{/each}
				{/each}
			</div>
		</div>

		<!-- Selected Muscle Groups -->
		<div>
			<h3 class="text-md font-semibold mb-2">Selected Tags:</h3>
			<div
				role="region"
				use:dndzone={{
					items,
					flipDurationMs: 300,
					dropTargetStyle: { borderColor: 'var(--color-primary-100)' },
					dropTargetClasses: ['border-[1px]', 'border-primary', 'border-solid']
				}}
				on:consider={handleConsider}
				on:finalize={handleFinalize}
				class="dnd-zone flex min-h-9 flex-wrap gap-2 rounded-lg border-[1px] border-base-300 bg-base-300 p-2 {isBadgeHovered ? 'border-primary' : ''}"
				on:mouseenter={onHoverStart}
				on:mouseleave={onHoverEnd}
			>
				{#each items as group (group.id)}
					<span
						class="badge badge-accent select-none"
						on:mouseenter={onHoverStart}
						on:mouseleave={onHoverEnd}
					>
						{group.id}
						<button type="button" on:click={() => removeMuscleGroup(group.id)} class="ml-1">
							<Icon icon="bi:x" class="h-4 w-4" />
						</button>
					</span>
				{/each}
			</div>
		</div>

		<!-- Measurements Section -->
		<div>
			<h2 class="text-lg font-semibold">Measurements</h2>
			<div class="flex flex-col gap-2">
				<!-- Reps -->
				<label class="flex items-center">
					<input type="checkbox" bind:group={selectedMeasurements} value="reps" class="checkbox" />
					<span class="ml-2">Reps</span>
				</label>
				{#if selectedMeasurements.includes('reps')}
					<div class="ml-6">
						<label class="label">Default Reps</label>
						<Counter
							bind:value={defaultReps}
							min={0}
							step={1}
							decimal={false}
						/>
					</div>
				{/if}

				<!-- Weight -->
				<label class="flex items-center">
					<input
						type="checkbox"
						bind:group={selectedMeasurements}
						value="weight"
						class="checkbox"
					/>
					<span class="ml-2">Weight</span>
				</label>
				{#if selectedMeasurements.includes('weight')}
					<div class="ml-6">
						<label class="label">Default Step (lbs)</label>
						<Counter
							bind:value={defaultStep}
							step={0.5}
							min={0}
							decimal={true}
						/>
					</div>
				{/if}

				<!-- Time -->
				<label class="flex items-center">
					<input type="checkbox" bind:group={selectedMeasurements} value="time" class="checkbox" />
					<span class="ml-2">Time</span>
				</label>

				<!-- Distance -->
				<label class="flex items-center">
					<input
						type="checkbox"
						bind:group={selectedMeasurements}
						value="distance"
						class="checkbox"
					/>
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
{/if}

<style>
	.badge:hover {
		opacity: 0.8;
	}
</style>
