<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-autofocus -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import Title from '$lib/components/Title.svelte';
	import type { Exercise } from '$lib/api/exercises';
	import Counter from '$lib/components/Counter.svelte';
	import RestStepper from '$lib/components/RestStepper.svelte';
	import Fab from '$lib/components/Fab.svelte';
	import { effectiveRest } from '$lib/rest';
	import { dndzone } from 'svelte-dnd-action';

	export let data;

	let { exerciseID, exercise, muscleGroups } = data;

	let exerciseName: string = exercise ? exercise.name : '';
	let selectedMuscleGroups: string[] = exercise
		? (exercise.muscleGroup || '')
				.split(',')
				.map((g) => g.trim())
		: [];
	let newMuscleGroup = '';

	let selectedMeasurements: string[] = exercise ? (exercise.measurement || []) : [];
	let defaultReps: number = exercise?.defaultReps ?? 0;
	let defaultStep: number = exercise?.defaultStep ?? 0;
	let restSeconds: number = effectiveRest(exercise?.restSeconds);
	let editingExerciseName = (exerciseID === 'new');

	function toggleEditExerciseName() {
		editingExerciseName = !editingExerciseName;
	}
	function handleExerciseNameBlur(e: FocusEvent) {
		exerciseName = (e.target as HTMLInputElement).value;
	}

	async function handleUpdateExerciseName() {
		if (exerciseID !== 'new' && exercise) {
			try {
				const res = await fetch('/api/exercises', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({
						id: exercise.id,
						name: exerciseName.trim()
					})
				});
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					throw new Error(body.error || `HTTP ${res.status}`);
				}
				editingExerciseName = false;
			} catch (err) {
				console.error('Error updating exercise name:', err);
				alert('Failed to update exercise name.');
			}
		} else {
			editingExerciseName = false;
		}
	}

	async function handleSubmit() {
		if (!exerciseName.trim()) {
			alert('Exercise name is required.');
			return;
		}

		const exerciseData: Partial<Exercise> = {
			name: exerciseName.trim(),
			muscleGroup: selectedMuscleGroups.join(', '),
			measurement: selectedMeasurements,
			restSeconds
		};

		if (selectedMeasurements.includes('reps')) {
			exerciseData.defaultReps = Math.round(defaultReps);
		}
		if (selectedMeasurements.includes('weight')) {
			exerciseData.defaultStep = parseFloat(defaultStep.toFixed(1));
		}

		try {
			const res = await fetch('/api/exercises', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					id: exerciseID === 'new' ? 'new' : exerciseID,
					...exerciseData
				})
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || `HTTP ${res.status}`);
			}
			goto('/home/exercises');
		} catch (err) {
			console.error('Error saving exercise:', err);
			alert('Failed to save exercise.');
		}
	}

	let items = selectedMuscleGroups.map((name) => ({ id: name }));

	function syncItems() {
		items = selectedMuscleGroups.map((name) => ({ id: name }));
	}

	function handleConsider(e: CustomEvent) {
		items = e.detail.items;
		selectedMuscleGroups = items.map((i) => i.id);
	}
	function handleFinalize(e: CustomEvent) {
		items = e.detail.items;
		selectedMuscleGroups = items.map((i) => i.id);
	}

	function removeMuscleGroup(name: string) {
		selectedMuscleGroups = selectedMuscleGroups.filter((m) => m !== name);
		syncItems();
	}

	function toggleMuscleGroup(group: string) {
		if (selectedMuscleGroups.includes(group)) {
			selectedMuscleGroups = selectedMuscleGroups.filter((g) => g !== group);
		} else {
			selectedMuscleGroups = [...selectedMuscleGroups, group];
		}
		syncItems();
	}

	function addNewMuscleGroup() {
		const group = newMuscleGroup.trim();
		if (group && !muscleGroups.includes(group)) {
			muscleGroups = [...muscleGroups, group];
			selectedMuscleGroups = [...selectedMuscleGroups, group];
			newMuscleGroup = '';
			syncItems();
		}
	}

	let isBadgeHovered = false;
	function onHoverStart() {
		isBadgeHovered = true;
	}
	function onHoverEnd() {
		isBadgeHovered = false;
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

		<!-- Chosen Muscle Groups with Drag & Drop -->
		<div>
			<h3 class="text-md font-semibold mb-2">Selected Tags:</h3>
			<div
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
						class="badge badge-accent badge-lg select-none gap-1 py-4 pr-0"
						on:mouseenter={onHoverStart}
						on:mouseleave={onHoverEnd}
					>
						{group.id}
						<button
							type="button"
							on:click={() => removeMuscleGroup(group.id)}
							aria-label="Remove {group.id}"
							class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/20"
						>
							<Icon icon="bi:x-lg" class="h-4 w-4" />
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
						<label class="label" for="Reps">Default Reps</label>
						<Counter bind:value={defaultReps} min={0} step={1} decimal={false} id="Reps" />
					</div>
				{/if}

				<label class="flex items-center">
					<input type="checkbox" bind:group={selectedMeasurements} value="weight" class="checkbox" />
					<span class="ml-2">Weight</span>
				</label>
				{#if selectedMeasurements.includes('weight')}
					<div class="ml-6">
						<label class="label" for="Step">Default Step (lbs)</label>
						<Counter bind:value={defaultStep} step={0.5} min={0} decimal={true} id="Step" />
					</div>
				{/if}

				<label class="flex items-center" for="Time">
					<input type="checkbox" bind:group={selectedMeasurements} value="time" class="checkbox" id="Time" />
					<span class="ml-2">Time</span>
				</label>

				<label class="flex items-center" for="Distance">
					<input type="checkbox" bind:group={selectedMeasurements} value="distance" class="checkbox" id="Distance" />
					<span class="ml-2">Distance</span>
				</label>
			</div>
		</div>

		<div>
			<label class="text-lg font-semibold" for="rest">Rest between sets</label>
			<p class="mb-2 text-sm opacity-60">Timer that starts after you log a set.</p>
			<RestStepper id="rest" bind:value={restSeconds} />
		</div>

		<!-- Submit Button -->
		<Fab type="submit" icon="bi:check2" label="Save exercise" />
	</form>
{:else}
	<p class="text-error">No exercise found or not authorized.</p>
{/if}

<style>
	.badge:hover {
		opacity: 0.8;
	}
</style>
