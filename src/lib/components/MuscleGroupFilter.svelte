<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let muscleGroups: string[] = [];
	export let selectedGroups: string[] = [];

	// Split and flatten muscleGroups into individualMuscleGroups
	$: individualMuscleGroups = Array.from(
		new Set(
			muscleGroups.flatMap(group =>
				group.split(',').map(g => g.trim())
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
		selectedSet = new Set(selectedSet); // Trigger reactivity
		dispatch('change', Array.from(selectedSet));
	}

	function clearSelection() {
		selectedSet.clear();
		selectedSet = new Set(selectedSet); // Trigger reactivity
		dispatch('change', Array.from(selectedSet));
	}

	// Update selectedSet if parent changes selectedGroups
	$: if (
		selectedGroups.length !== selectedSet.size ||
		!selectedGroups.every((g) => selectedSet.has(g))
	) {
		selectedSet = new Set<string>(selectedGroups);
	}

	$: isEmpty = selectedSet.size === 0;
</script>

<div class="flex flex-col gap-4">
	<!-- Muscle Group Filtering -->
	<div class="flex flex-wrap gap-2 select-none">
		{#each individualMuscleGroups as muscleGroup}
			<span
				class="badge cursor-pointer transition-colors
                    {selectedSet.has(muscleGroup) ? 'badge-accent' : 'text-neutral-content badge-outline'}"
				on:click={() => toggleSelection(muscleGroup)}
				aria-label={`Filter by ${muscleGroup}`}
			>
				{muscleGroup}
			</span>
		{/each}
		<button
			class={`${isEmpty ? '' : 'link-hover'} text-sm ${isEmpty ? 'text-neutral' : 'text-neutral-content'}`}
			on:click={clearSelection}
			disabled={isEmpty}
		>
			Clear Selection
		</button>
	</div>
</div>
