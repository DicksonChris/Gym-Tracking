<script lang="ts">
    import '../app.css';
    import ThemeDropdown from '$lib/components/Header/ThemeDropdown.svelte';
    import Nav from '$lib/components/Header/Nav.svelte';
    import { onMount } from 'svelte';
    import { loadExercises } from '$lib/stores/exercisesStore';
    export let children: () => any; 

    // Initialize exercises store on component mount
    onMount(() => {
        loadExercises();
    });
</script>

<div class="min-h-screen bg-base-200 text-primary font-sans">
    <header class="flex justify-between p-4 bg-secondary mb-2">
        <Nav />
        <ThemeDropdown />
    </header>
    <main class="container mx-auto p-2">
        {@render children()}
    </main>
</div>
