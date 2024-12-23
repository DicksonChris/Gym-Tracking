<script>
    import { onMount } from 'svelte';
    import ExerciseHistory from './ExerciseHistory.svelte'; // Import the new component
    import ExerciseItem from './ExerciseItem.svelte';
    import WorkoutItem from './WorkoutItem.svelte';
    
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
        <WorkoutItem {workout} {exercisesData} {historyData} />
    {/each}
</ul>
