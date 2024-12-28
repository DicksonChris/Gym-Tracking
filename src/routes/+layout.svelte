<script lang="ts">
    import '../app.css';
    import ThemeDropdown from '$lib/components/ThemeDropdown.svelte';
    import Nav from '$lib/components/Nav.svelte'; // Import Nav component
    export let children: () => any; // Ensure children is a function
</script>

<div class="min-h-screen bg-base-100 text-primary">
    <header class="flex justify-between p-4 bg-secondary">
        <Nav /> <!-- Include Nav component -->
        <ThemeDropdown />
    </header>
    <main class="container mx-auto p-8">
        {@render children()}
    </main>
</div>
