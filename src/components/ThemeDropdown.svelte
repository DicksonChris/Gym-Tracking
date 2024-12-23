<script>
    import { onMount } from 'svelte';
    let themes = [
        "light",
        "dark",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "black",
        "luxury",
        "dracula",
        "cmyk",
        "autumn",
        "business",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "winter"
    ];
    
    let selectedTheme = 'light';
    
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
    class="select select-bordered bg-secondary text-primary"
    aria-label="Select Theme"
>
    {#each themes as theme}
        <option value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
    {/each}
</select>
