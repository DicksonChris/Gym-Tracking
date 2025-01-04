<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let muscleGroups: string[] = [];
	export let selectedGroups: string[] = [];

	let selectedSet = new Set<string>(selectedGroups);

	function toggleSelection(mg: string) {
		if (selectedSet.has(mg)) {
			selectedSet.delete(mg);
		} else {
			selectedSet.add(mg);
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

<div class="mb-4 flex flex-col gap-4">
	<!-- Muscle Group Filtering -->
	<div class="flex flex-wrap gap-2">
		{#each muscleGroups as mg}
			<span
				class="badge cursor-pointer transition-colors
                    {selectedSet.has(mg) ? 'badge-accent' : 'badge-outline'}"
				on:click={() => toggleSelection(mg)}
			>
				{mg}
			</span>
		{/each}
		<button
			class={`link-hover text-sm ${isEmpty ? 'text-neutral' : 'text-primary'}`}
			on:click={clearSelection}
			disabled={isEmpty}
		>
			Clear Selection
		</button>
	</div>
</div>
