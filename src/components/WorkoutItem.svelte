<script>
    import ExerciseItem from './ExerciseItem.svelte';
    import ExerciseHistory from './ExerciseHistory.svelte';

    export let workout;
    export let exercisesData;
    export let historyData;
</script>

<li class="card bg-base-200 shadow-lg">
    <h2 class="card-title">{workout.groupName}</h2>
    <ul class="ml-4 space-y-4">
        {#each workout.exercises as exerciseId}
            <ExerciseItem {exerciseId} {exercisesData} {historyData} />
        {/each}
    </ul>
</li>
