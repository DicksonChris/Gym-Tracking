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
        <li class="bg-white rounded-lg p-6"> <!-- Removed 'flex items-center' classes -->
            <!-- Removed SVG Symbol -->
            <h2 class="text-2xl font-semibold mb-4 text-blue-600">{workout.groupName}</h2>
            <!-- Existing content -->

            <ul class="ml-4 space-y-4">
                {#each workout.exercises as exerciseId}
                    <li class="flex flex-col">
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-medium text-gray-700">{exercisesData[exerciseId]?.name}</span>
                            <span class="text-sm text-gray-500">({exercisesData[exerciseId]?.muscleGroup})</span>
                        </div>
                        {#if historyData[exerciseId]}
                            <ExerciseHistory history={historyData[exerciseId]} /> <!-- Use the new component -->
                        {/if}
                    </li>
                {/each}
            </ul>
        </li>
    {/each}
</ul>
