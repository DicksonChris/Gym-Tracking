<!-- FilteredExercises.svelte -->
<script lang="ts">
    import { hideExercise, unhideExercise } from '$lib/api/exercises';
    import type { Exercise } from '$lib/api/exercises';

    export let exercises: Exercise[] = [];
    export let selectedMuscleGroup: string = '';

    let query = '';
    let selectedExercises = new Set<string>();

    function toggleSelection(id: string) {
        if (selectedExercises.has(id)) {
            selectedExercises.delete(id);
        } else {
            selectedExercises.add(id);
        }
    }

    function selectAll() {
        exercises.forEach(e => {
            if (!selectedMuscleGroup || e.muscleGroup === selectedMuscleGroup) {
                selectedExercises.add(e.id);
            }
        });
    }

    function selectNone() {
        selectedExercises.clear();
    }

    $:
        filteredExercises = exercises
            .filter(e => !selectedMuscleGroup || e.muscleGroup === selectedMuscleGroup)
            .filter(e => !query || e.name.toLowerCase().includes(query.toLowerCase()));
</script>

<div class="flex items-center gap-2 mb-4">
    <input
        type="text"
        bind:value={query}
        placeholder="Search exercises..."
        class="input input-bordered w-full max-w-xs"
    />
    <button on:click={selectAll} class="btn btn-primary">Select All</button>
    <button on:click={selectNone} class="btn btn-secondary">Select None</button>
</div>

{#each filteredExercises as exercise}
<div
    class="border p-2 mb-2 rounded-md shadow-md relative flex flex-col gap-1
        {selectedExercises.has(exercise.id) ? 'bg-primary text-white' : 'bg-base-200'}"
>
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">{exercise.name}</h2>
        <button
            class="badge cursor-pointer"
            on:click={() => toggleSelection(exercise.id)}
        >
            {selectedExercises.has(exercise.id) ? 'Deselect' : 'Select'}
        </button>
    </div>
    <p>Muscle Group: {exercise.muscleGroup}</p>
    {#if exercise.measurement && exercise.measurement.length > 0}
        <ul>
            {#each exercise.measurement as m}
                <li>{m}</li>
            {/each}
        </ul>
    {:else}
        <p>No measurement</p>
    {/if}
    <p>
        Hidden:
        {#if exercise.hidden}
            <button on:click={() => unhideExercise(exercise.id)} class="btn btn-sm btn-accent">Unhide</button>
        {:else}
            <button on:click={() => hideExercise(exercise.id)} class="btn btn-sm btn-warning">Hide</button>
        {/if}
    </p>
</div>
{/each}
