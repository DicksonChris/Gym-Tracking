<script lang="ts">
    import type { Exercise } from '$lib/api/exercises';
    import { goto } from '$app/navigation';
    import { toggleHidden, exercisesStore } from '$lib/stores/exercisesStore';
    import MuscleGroupFilter from '$lib/components/MuscleGroupFilter.svelte';
    import ToggleHidden from '$lib/components/ToggleHidden.svelte';
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
    $: filteredExercises = exercises.filter((e) => {
        const exerciseGroups = e.muscleGroup.split(',').map((g) => g.trim());
        const matchesGroup =
            selectedGroups.length === 0 || exerciseGroups.some((g) => selectedGroups.includes(g));

        const matchesHidden = showHiddenExercises ? e.hidden : true;
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
    <div class="mb-4 flex justify-end">
        <button on:click={toggleShowHidden} class="link-hover">
            {showHiddenExercises ? 'Show All' : 'See Disabled'}
        </button>
    </div>

    <!-- Filtered Exercises -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each filteredExercises as exercise (exercise.id)}
            <div class="card bg-base-100 p-4 shadow-lg max-w-sm mx-auto">
                <span class="mb-2 flex items-center justify-between">
                    <span class="flex flex-row">
                        <h2 class="text-2xl font-semibold">{exercise.name}</h2>
                        {#if exercise.hidden}
                            <span class="badge badge-outline text-base-content ml-2">disabled</span>
                        {/if}
                    </span>
                    <span class="flex items-center">
                    <button on:click={() => handleEditClick(exercise.id)} aria-label="Edit workout">
                        <Icon icon="bi:three-dots-vertical" class="h-6 w-10 text-white" />
                    </button>
                    <div class="flex items-center">
                        <ToggleHidden {exercise} />
                    </div>
                </span>
                </span>

                <div class="mb-4 flex flex-wrap gap-2">
                    {#each exercise.muscleGroup.split(',').map((g) => g.trim()) as group}
                        <span class="badge badge-accent">{group}</span>
                    {/each}
                </div>

                {#if exercise.measurement && exercise.measurement.length > 0}
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each exercise.measurement as m}
                            <span class="badge badge-info">{m}</span>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    <!-- Floating Create Button -->
    <button
        aria-label="Create Exercise"
        title="Create Exercise"
        class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
        on:click={handleCreateClick}
    >
        <Icon icon="bi:plus-lg" class="h-6 w-6" />
    </button>
</main>

<style>
    /* Optional: Add any page-specific styles here */

    /* Center the cards and limit their width */
    .card {
        width: 100%;
    }

    @media (min-width: 640px) {
        .card {
            max-width: 24rem; /* Adjust as needed */
        }
    }
</style>
