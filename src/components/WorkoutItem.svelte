<script>
    import ExerciseItem from './ExerciseItem.svelte';
    import { workoutsStore, exercisesStore, historyStore } from '$lib/stores';
    
    export let workoutId;
    $: allWorkouts = $workoutsStore;
    $: workout = allWorkouts.find(w => w.id === workoutId);

    $: allExercises = $exercisesStore;
    $: allHistory = $historyStore;
</script>

<li class="card bg-base-100 shadow-lg">
    <h2 class="card-title">{workout.groupName}</h2>
    <ul class="ml-4 space-y-4">
        {#each workout.exercises as exerciseId}
            <ExerciseItem {exerciseId} />
        {/each}
    </ul>
</li>