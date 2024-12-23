<script>
    import { onMount } from 'svelte';
    import WorkoutItem from './WorkoutItem.svelte';
    import { fetchExercises, fetchHistory } from '$lib/api'; // Import API functions

    export let workouts = [];

    let exercisesData = {};
    let historyData = {};

    onMount(async () => {
        const exercises = await fetchExercises();
        exercisesData = exercises.reduce((acc, exercise) => {
            acc[exercise.id] = exercise;
            return acc;
        }, {});

        const history = await fetchHistory();
        historyData = history.reduce((acc, entry) => {
            if (!acc[entry.exerciseId]) acc[entry.exerciseId] = [];
            acc[entry.exerciseId].push(entry);
            return acc;
        }, {});
    });
</script>

<ul class="space-y-6">
    {#each workouts as workout}
        <WorkoutItem {workout} {exercisesData} {historyData} />
    {/each}
</ul>
