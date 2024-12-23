<script>
    import { onMount } from 'svelte';
    import WorkoutList from '../components/WorkoutList.svelte';
    import { fetchWorkouts } from '$lib/api'; // Import fetchWorkouts from API utility

    let workouts = [];

    onMount(async () => {
        workouts = await fetchWorkouts();
    });
</script>

<main class="container mx-auto p-8">
    <h1 class="text-4xl font-bold mb-4 text-center">Workouts</h1>
    <WorkoutList {workouts} />

    
</main>