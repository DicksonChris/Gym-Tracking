<script>
    import { onMount } from 'svelte';
    import WorkoutList from '../components/WorkoutList.svelte';

    let workouts = [];

    async function fetchWorkouts() {
        const response = await fetch('http://localhost:3000/workouts');
        workouts = await response.json();
    }

    onMount(() => {
        fetchWorkouts();
    });
</script>

<main class="container mx-auto p-8">
    <h1 class="text-4xl font-bold mb-4 text-center">Workouts</h1>
    <WorkoutList {workouts} />
</main>