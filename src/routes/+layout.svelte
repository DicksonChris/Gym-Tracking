<script lang="ts">
    import '../app.css';
    import ThemeDropdown from '../components/ThemeDropdown.svelte';
    let { children } = $props();
</script>

<div class="min-h-screen bg-base-100 text-primary"> <!-- Changed to text-primary -->
    <header class="flex justify-end p-4 bg-secondary"> <!-- Removed any text-primary class if present -->
        <ThemeDropdown />
    </header>
    <main class="container mx-auto p-8">
        <slot />
    </main>
</div>
