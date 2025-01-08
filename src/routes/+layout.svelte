<script lang="ts">
    import '../app.css';
    import ThemeDropdown from '$lib/components/Header/ThemeDropdown.svelte';
    import Nav from '$lib/components/Header/Nav.svelte';
    import { onMount } from 'svelte';
    import { loadExercises } from '$lib/stores/exercisesStore';
    export let children: () => any; 

    onMount(() => {
        loadExercises();
    });
</script>

<div class="min-h-screen bg-base-200 text-primary font-sans">
    <header class="fixed top-0 w-full z-10 flex justify-between p-4 bg-base-200">
        <Nav />
        <ThemeDropdown />
    </header>
    <main class="container mx-auto p-2 pt-20">
        {@render children()}
    </main>
</div>
