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
        dispatch('change', Array.from(selectedSet));
    }

    function selectAll() {
        muscleGroups.forEach(mg => selectedSet.add(mg));
        dispatch('change', Array.from(selectedSet));
    }

    function selectNone() {
        selectedSet.clear();
        dispatch('change', Array.from(selectedSet));
    }

    // Update selectedSet if parent changes selectedGroups
    $: if (
        selectedGroups.length !== selectedSet.size ||
        !selectedGroups.every(g => selectedSet.has(g))
    ) {
        selectedSet = new Set<string>(selectedGroups);
    }
</script>

<div class="mb-4 flex flex-col gap-4">
    <!-- Select All / Select None Buttons -->
    <div class="flex gap-2">
        <button class="btn btn-primary" on:click={selectAll}>Select All</button>
        <button class="btn btn-secondary" on:click={selectNone}>Select None</button>
    </div>

    <!-- Muscle Group Badges -->
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
    </div>
</div>