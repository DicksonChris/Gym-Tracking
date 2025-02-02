<script lang="ts">
	import type { Exercise } from '$lib/api/exercises';
	import { goto } from '$app/navigation';
	import MuscleGroupFilter from '$lib/components/MuscleGroupFilter.svelte';
	import Icon from '@iconify/svelte';

	export let data: { allExercises: Exercise[] };

	// Local array from SSR
	let exercises = data.allExercises ?? [];

	let selectedGroups: string[] = [];
	let muscleGroups: string[] = [];
	let showHiddenExercises = false;

	// Build muscleGroups from loaded data
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

	/**
	 * Handle toggling hidden directly here, rather than in a separate component.
	 */
	async function handleHiddenChange(exercise: Exercise) {
		// Flip the local hidden flag for immediate UI feedback
		exercise.hidden = !exercise.hidden;

		// Attempt to update on the server
		try {
			await fetch('/api/exercises/toggleHidden', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					id: exercise.id,
					hidden: exercise.hidden
				})
			});
			// If successful, do nothing else — local state is now correct.
		} catch (err) {
			console.error('Failed to toggle hidden:', err);
			// Revert local change on failure
			exercise.hidden = !exercise.hidden;
			alert('Failed to update hidden status.');
		}
	}

	/**
	 * Filter exercises by muscle groups + hidden toggle
	 */
	$: filteredExercises = exercises
		.filter((e) => {
			const groups = e.muscleGroup ? e.muscleGroup.split(',').map((g) => g.trim()) : [];
			const matchesGroup =
				selectedGroups.length === 0 || groups.some((g) => selectedGroups.includes(g));
			// Only show hidden if showHiddenExercises is true or the exercise isn't hidden
			const matchesHidden = showHiddenExercises ? true : !e.hidden;
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
			{showHiddenExercises ? 'Show Enabled Only' : 'Show Disabled'}
		</button>
	</div>

	<div class="text-base-content">
		<!-- Table header row -->
		<div
			class="sticky top-[65px] z-50 grid grid-cols-[4fr_2fr_1fr] gap-2 border-b border-base-content bg-base-100 px-4 py-2 font-semibold text-primary"
		>
			<div class="text-center text-sm">Exercise</div>
			<div class="text-start text-sm">Tags</div>
			<div class="text-start text-sm">Disable</div>
		</div>

		<!-- Filtered exercise rows -->
		{#each filteredExercises as exercise (exercise.id)}
			<div class="mb-2 grid grid-cols-[4fr_2fr_1fr] items-center gap-2 px-4">
				<!-- Left: Name/edit button -->
				<div class="flex items-center overflow-hidden text-nowrap font-semibold">
					<button on:click={() => handleEditClick(exercise.id)} class="mr-2 focus:outline-none">
						<Icon icon="bi:three-dots-vertical" class="h-6 w-6" />
					</button>
					<span class="max-w-full truncate">{exercise.name}</span>
				</div>

				<!-- Middle: muscle group tags -->
				<div class="flex flex-wrap gap-2">
					{#each exercise.muscleGroup?.split(',').map((g) => g.trim()) as group}
						<span
							class="badge badge-accent badge-sm overflow-hidden truncate whitespace-nowrap"
							title={group}
						>
							{group}
						</span>
					{/each}
				</div>

				<!-- Right: inline toggle for hidden -->
				<div>
					<label class="label flex cursor-pointer items-center">
						<input
							type="checkbox"
							class="toggle toggle-xs"
							checked={!exercise.hidden}
							title={!exercise.hidden ? 'Click to disable' : 'Click to enable'}
							on:change={() => handleHiddenChange(exercise)}
						/>
					</label>
				</div>
			</div>
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
	
	.toggle {
		flex-shrink: 0;
		--tglbg: var(--fallback-b1, oklch(var(--b1) / 1));
		--handleoffset: 1.5rem /* 24px */;
		--handleoffsetcalculator: calc(var(--handleoffset) * -1);
		--togglehandleborder: 0 0;
		height: 1.5rem /* 24px */;
		width: 3rem /* 48px */;
		cursor: pointer;
		appearance: none;
		border-radius: var(--rounded-badge, 1.9rem /* 30.4px */);
		border-width: 1px;
		border-color: currentColor;
		background-color: currentColor;
		color: var(--fallback-bc, oklch(var(--bc) / 0.5));
		transition:
			background,
			box-shadow var(--animation-input, 0.2s) ease-out;
		box-shadow:
			var(--handleoffsetcalculator) 0 0 2px var(--tglbg) inset,
			0 0 0 2px var(--tglbg) inset,
			var(--togglehandleborder);
	}

	.toggle:focus-visible {
		outline-style: solid;
		outline-width: 2px;
		outline-offset: 2px;
		outline-color: var(--fallback-bc, oklch(var(--bc) / 0.2));
	}
	.toggle:hover {
		background-color: currentColor;
	}
	.toggle:checked,
	.toggle:indeterminate {
		background-image: none;
		--handleoffsetcalculator: var(--handleoffset);
		--tw-text-opacity: 1;
		color: var(--fallback-bc, oklch(var(--bc) / var(--tw-text-opacity)));
	}

	.toggle:indeterminate {
		--tw-text-opacity: 1;
		color: var(--fallback-bc, oklch(var(--bc) / var(--tw-text-opacity)));
		box-shadow:
			calc(var(--handleoffset) / 2) 0 0 2px var(--tglbg) inset,
			calc(var(--handleoffset) / -2) 0 0 2px var(--tglbg) inset,
			0 0 0 2px var(--tglbg) inset;
	}

	.toggle:disabled {
		cursor: not-allowed;
		--tw-border-opacity: 1;
		border-color: var(--fallback-bc, oklch(var(--bc) / var(--tw-border-opacity)));
		background-color: transparent;
		opacity: 0.3;
		--togglehandleborder: 0 0 0 3px var(--fallback-bc, oklch(var(--bc) / 1)) inset;
	}

	[type='checkbox'].toggle-xs {
		--handleoffset: 0.5rem /* 8px */;
		height: 1rem /* 16px */;
		width: 1.5rem /* 24px */;
	}	
</style>
