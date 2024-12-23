<script>
    import { onMount } from 'svelte';
    import ExerciseHistory from './ExerciseHistory.svelte'; // Import the new component

    export let workouts = [];

    let exercisesData = {};
    let historyData = {};

    async function fetchExercises() {
        const response = await fetch('http://localhost:3000/exercises');
        const exercises = await response.json();
        exercisesData = exercises.reduce((acc, exercise) => {
            acc[exercise.id] = exercise;
            return acc;
        }, {});
    }

    async function fetchHistory() {
        const response = await fetch('http://localhost:3000/history');
        const history = await response.json();
        historyData = history.reduce((acc, entry) => {
            if (!acc[entry.exerciseId]) acc[entry.exerciseId] = [];
            acc[entry.exerciseId].push(entry);
            return acc;
        }, {});
    }

    onMount(() => {
        fetchExercises();
        fetchHistory();
    });
</script>

<ul class="space-y-6">
    {#each workouts as workout}
        <li class="card bg-base-100 shadow-lg"> <!-- Replaced with DaisyUI's card class -->
            <h2 class="card-title">{workout.groupName}</h2> <!-- Removed text-primary -->
            <ul class="ml-4 space-y-4">
                {#each workout.exercises as exerciseId}
                    <li class="flex flex-col">
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-medium text-primary">{exercisesData[exerciseId]?.name}</span> <!-- Changed to text-primary -->
                            <span class="text-sm text-primary">{exercisesData[exerciseId]?.muscleGroup}</span> <!-- Changed to text-primary -->
                        </div>
                        {#if historyData[exerciseId]}
                            <ExerciseHistory history={historyData[exerciseId]} />
                        {/if}
                    </li>
                {/each}
            </ul>
        </li>
    {/each}
</ul>
