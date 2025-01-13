<script lang="ts">
	import type { Exercise } from '$lib/api/exercises';
	import { goto } from '$app/navigation';
	import { toggleHidden, exercisesStore } from '$lib/stores/exercisesStore';
	import MuscleGroupFilter from '$lib/components/MuscleGroupFilter.svelte';
	import ToggleHidden from '$lib/components/ToggleHidden.svelte';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	// Data from +page.ts
	export let data: { allExercises: Exercise[] };

	// Initialize the store with data from +page.ts on component mount
	onMount(() => {
		exercisesStore.set(data.allExercises || []);
	});

	// Auto-subscribe to the exercisesStore
	let exercises: Exercise[] = [];
	$: exercises = $exercisesStore || [];

	let selectedGroups: string[] = [];
	let muscleGroups: string[] = [];
	let showHiddenExercises = false;

	// Build unique muscleGroups reactive to exercises
	$: {
		const groups = new Set<string>();
		exercises.forEach((e) => {
			if (e.muscleGroup) {
				e.muscleGroup
					.split(',')
					.map((g) => g.trim())
					.forEach((g) => groups.add(g));
			}
		});
		muscleGroups = Array.from(groups);
	}

	// Handle updates from filter
	function handleMuscleGroupChange(e: CustomEvent<string[]>) {
		selectedGroups = e.detail;
	}

	function handleCreateClick() {
		goto('/exercises/new');
	}

	function handleEditClick(exerciseID: string) {
		goto(`/exercises/${exerciseID}`);
	}

	function toggleShowHidden() {
		showHiddenExercises = !showHiddenExercises;
	}

	// Toggle hidden status using store
	function handleToggleHidden(exercise: Exercise) {
		toggleHidden(exercise);
	}

	// Filter exercises reactively based on selected groups and hidden status
	$: filteredExercises = exercises
		.filter((e) => {
			const groups = e.muscleGroup ? e.muscleGroup.split(',').map((g) => g.trim()) : [];
			const matchesGroup =
				selectedGroups.length === 0 || groups.some((g) => selectedGroups.includes(g));
			const matchesHidden = showHiddenExercises ? e.hidden : true;
			return matchesGroup && matchesHidden;
		})
		.sort((a, b) => a.name.localeCompare(b.name));
</script>

<main class="center container card mx-auto bg-base-100 py-4">
	<div class="px-2">
		<MuscleGroupFilter {muscleGroups} {selectedGroups} on:change={handleMuscleGroupChange} />
	</div>
	<div class="mb-4 flex justify-end border-b-[1px] border-primary p-2 text-white">
		<button on:click={toggleShowHidden} class="link-hover">
			{showHiddenExercises ? 'Show All' : 'See Disabled'}
		</button>
	</div>

	<div class="text-base-content">
		<div
			class="sticky top-[65px] z-50 grid grid-cols-[4fr_2fr_1fr] gap-2 border-b border-base-content bg-base-100 px-4 py-2 font-semibold text-primary"
		>
			<div class="text-center text-sm">Exercise</div>
			<div class="text-start text-sm">Tags</div>
			<div class="text-start text-sm">Disable</div>
		</div>
		<!-- Rows -->
		{#each filteredExercises as exercise (exercise.id)}
			{#if !exercise.hidden || showHiddenExercises}
				<div class="mb-2 grid grid-cols-[4fr_2fr_1fr] items-center gap-2 px-4">
					<div class="flex items-center font-semibold text-nowrap overflow-hidden">
						<button on:click={() => handleEditClick(exercise.id)} class="mr-2 focus:outline-none">
							{#if browser}
								<Icon icon="bi:three-dots-vertical" class="h-6 w-6" />
							{:else}
								<svg
									class="mr-2 h-4 w-4 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<circle cx="12" cy="12" r="1"></circle>
									<circle cx="12" cy="5" r="1"></circle>
									<circle cx="12" cy="19" r="1"></circle>
								</svg>
							{/if}
						</button>
						<span class="truncate max-w-full">
							{exercise.name}
						</span>
					</div>

					<div class="flex flex-wrap gap-1">
						{#each exercise.muscleGroup.split(',').map(g => g.trim()) as group}
							<span class="badge badge-accent badge-xs whitespace-nowrap overflow-hidden truncate" title={group}>
								{group}
							</span>
						{/each}
					</div>

					<div>
						<ToggleHidden {exercise} />
					</div>
				</div>
			{/if}
		{/each}
	</div>
</main>
<!-- Floating Create Button -->
<button
	aria-label="Create Exercise"
	title="Create Exercise"
	class="btn btn-circle btn-primary btn-lg fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50 hover:btn-neutral hover:text-primary"
	on:click={handleCreateClick}
>
	<Icon icon="bi:plus-lg" class="h-6 w-6" />
</button>

<style>
	:root {
		background-color: #1b1e2b;
	}
</style>
