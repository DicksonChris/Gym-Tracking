<script>
    import { onMount } from 'svelte';
    import WorkoutItem from './WorkoutItem.svelte';
    import { workoutsStore, loadExercises, loadHistory, exercisesStore, historyStore } from '$lib/stores';

    $: exercisesData = $exercisesStore;
    $: historyData = $historyStore;
    $: workouts = $workoutsStore;

    onMount(() => {
        loadExercises();
        loadHistory();
    });
</script>

<ul class="space-y-6">
    {#each workouts as workout}
        <WorkoutItem workoutId={workout.id} />
    {/each}
</ul>
