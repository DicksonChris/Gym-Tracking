<script>
    import { onMount } from 'svelte';
    import WorkoutList from '../components/WorkoutList.svelte';
    import { loadWorkouts } from '$lib/stores';

    onMount(async () => {
        await loadWorkouts();
    });
</script>

<main class="container mx-auto p-8">
    <h1 class="text-4xl font-bold mb-4 text-center">Workouts</h1>
    <WorkoutList />
</main>