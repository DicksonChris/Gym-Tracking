<script lang="ts">
	import { themeStore } from '$lib/stores/themeStore';
	export let initialTheme: string = 'dracula';

	const themes = [
		'autumn',
		'cmyk',
		'cupcake',
		'cyberpunk',
		'fantasy',
		'garden',
		'lemonade',
		'light',
		'pastel',
		'valentine',
		'aqua',
		'black',
		'business',
		'coffee',
		'dark',
		'dim',
		'dracula',
		'forest',
		'halloween',
		'luxury',
		'night',
		'palenight',
		'sunset',
		'synthwave',
	];

	// Initialize with passed theme
	$: if (initialTheme) {
		themeStore.set(initialTheme);
	}

	function handleChange(event: Event) {
		const newTheme = (event.target as HTMLSelectElement).value;
		themeStore.set(newTheme);
	}
</script>

<select
	bind:value={$themeStore}
	on:change={handleChange}
	class="select select-ghost select-xs pb-6 text-base-content"
	aria-label="Select Theme"
>
	{#each themes as theme, idx}
		{#if idx===10}<hr>{/if}
		<option value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
	{/each}
</select>
