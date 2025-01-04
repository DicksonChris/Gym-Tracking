<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { showHidden, getExercises, type Exercise } from '$lib/api/exercises';
    import MuscleGroupFilter from '$lib/components/MuscleGroupFilter.svelte';

    let exercises: Exercise[] = [];
    let selectedGroups: string[] = [];
    let muscleGroups: string[] = [];
    let showHiddenExercises: boolean = false; // Track hidden exercises visibility

    onMount(async () => {
        exercises = await getExercises();
        const groups = new Set(exercises.map(e => e.muscleGroup).filter(Boolean));
        muscleGroups = Array.from(groups);
    });

    function handleMuscleGroupChange(e: CustomEvent<string[]>) {
        selectedGroups = e.detail;
    }

    function handleCreateClick() {
        goto('/exercises/new');
    }

    function toggleShowHidden() {
        showHiddenExercises = !showHiddenExercises;
    }

    // Filter exercises based on selected groups and hidden status
    $: filteredExercises = exercises.filter(e => {
        const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(e.muscleGroup);
        const matchesHidden = showHiddenExercises || !e.hidden;
        return matchesGroup && matchesHidden;
    });
</script>

<main class="container mx-auto p-4">
    <h1 class="mb-6 text-center text-4xl font-bold">Exercises</h1>

    <!-- Muscle Group Filter -->
    <MuscleGroupFilter
        {muscleGroups}
        {selectedGroups}
        on:change={handleMuscleGroupChange}
    />

    <!-- Show Hidden Button -->
    <div class="mb-4">
        <button on:click={toggleShowHidden} class="btn btn-warning">
            {showHiddenExercises ? 'Hide Hidden' : 'Show Hidden'}
        </button>
    </div>

    <!-- Create New Exercise Button -->
    <div class="mb-6">
        <button on:click={handleCreateClick} class="btn btn-success">
            Create New Exercise
        </button>
    </div>

    <!-- Filtered Exercises List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredExercises as exercise}
            <div class="card bg-base-100 shadow-lg p-4">
                <h2 class="text-2xl font-semibold mb-2">{exercise.name}</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="badge badge-accent">{exercise.muscleGroup}</span>
                    {#if exercise.hidden}
                        <span class="badge badge-warning">Hidden</span>
                    {/if}
                </div>
                <p class="mb-2">
                    <strong>Measurements:</strong>
                    {#if exercise.measurement && exercise.measurement.length > 0}
                        <ul class="list-disc list-inside">
                            {#each exercise.measurement as m}
                                <li>{m}</li>
                            {/each}
                        </ul>
                    {:else}
                        None
                    {/if}
                </p>
                <div class="flex gap-2">
                    {#if exercise.hidden}
                        <button on:click={() => unhideExercise(exercise.id)} class="btn btn-sm btn-success">
                            Unhide
                        </button>
                    {:else}
                        <button on:click={() => hideExercise(exercise.id)} class="btn btn-sm btn-error">
                            Hide
                        </button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</main>