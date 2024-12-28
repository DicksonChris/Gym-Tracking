<script lang="ts">
	import { onMount } from 'svelte';
    import { getWorkouts, type Workout } from '$lib/api/workouts';
	import ExerciseItem from '$lib/components/ExerciseItem.svelte';

    let workouts: Workout[] = [];
	onMount(async () => {
        workouts = await getWorkouts();
	});
</script>

<main class="container mx-auto p-8">
	<h1 class="mb-4 text-center text-4xl font-bold">Workouts</h1>
	<!-- Print workouts to screen from api -->
    {#each workouts as workout}
        <h2>{workout.groupName}</h2>
        
        {#if workout.exercises}
            {#each workout.exercises as exerciseID}
                <ExerciseItem {exerciseID} />
            {/each}
        {/if}

        <br />
    {/each}
</main>
