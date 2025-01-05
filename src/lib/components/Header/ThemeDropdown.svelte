<script>
    import { onMount } from 'svelte';
    let themes = [
            "aqua",
            "black",
            "business",
            "coffee",
            "dark",
            "dim",
            "dracula",
            "forest",
            "halloween",
            "luxury",
            "night",
            "sunset",
            "synthwave"
    ];
    
    let selectedTheme = 'dracula';
    
    onMount(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme && themes.includes(storedTheme)) {
            selectedTheme = storedTheme;
            applyTheme(selectedTheme);
        } else {
            applyTheme(selectedTheme);
        }
    });
    
    function applyTheme(theme) {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    function handleChange(event) {
        selectedTheme = event.target.value;
        applyTheme(selectedTheme);
    }
</script>

<select
    bind:value={selectedTheme}
    on:change={handleChange}
    class="select select-bordered bg-secondary text-primary-content"
    aria-label="Select Theme"
>
    {#each themes as theme}
        <option value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
    {/each}
</select>
