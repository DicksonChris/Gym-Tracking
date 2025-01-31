<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let muscleGroups: string[] = [];
	export let selectedGroups: string[] = [];

	const dispatch = createEventDispatcher();

	// Flatten muscleGroups
	$: individualMuscleGroups = Array.from(
		new Set(
			muscleGroups.flatMap((group) =>
				group.split(',').map((g) => g.trim())
			)
		)
	);

	let selectedSet = new Set<string>(selectedGroups);

	function toggleSelection(muscleGroup: string) {
		if (selectedSet.has(muscleGroup)) {
			selectedSet.delete(muscleGroup);
		} else {
			selectedSet.add(muscleGroup);
		}
		selectedSet = new Set(selectedSet); // re-trigger reactivity
		dispatch('change', Array.from(selectedSet));
	}

	function clearSelection() {
		selectedSet.clear();
		selectedSet = new Set(selectedSet);
		dispatch('change', Array.from(selectedSet));
	}

	// Keep selectedSet in sync if parent changes selectedGroups
	$: if (
		selectedGroups.length !== selectedSet.size ||
		!selectedGroups.every((g) => selectedSet.has(g))
	) {
		selectedSet = new Set<string>(selectedGroups);
	}

	$: isEmpty = selectedSet.size === 0;
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap gap-2 select-none">
		{#each individualMuscleGroups as muscleGroup}
			<button
				class="badge cursor-pointer transition-colors
					{selectedSet.has(muscleGroup)
						? 'badge-accent'
						: 'text-neutral-content badge-outline'}"
				on:click={() => toggleSelection(muscleGroup)}
				aria-label={`Filter by ${muscleGroup}`}
			>
				{muscleGroup}
			</button>
		{/each}
		<button
			class="{isEmpty ? 'text-neutral' : 'text-neutral-content link-hover'} text-sm"
			on:click={clearSelection}
			disabled={isEmpty}
		>
			Clear Selection
		</button>
	</div>
</div>