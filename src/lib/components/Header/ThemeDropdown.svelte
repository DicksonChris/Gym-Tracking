<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/** The currently active theme (owned by the parent). */
	export let theme: string = 'dracula';

	const dispatch = createEventDispatcher<{ change: string }>();

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

	function handleChange(event: Event) {
		dispatch('change', (event.target as HTMLSelectElement).value);
	}
</script>

<select
	value={theme}
	on:change={handleChange}
	class="select select-ghost select-xs pb-6 text-base-content"
	aria-label="Select Theme"
>
	{#each themes as themeName, idx}
		{#if idx===10}<hr>{/if}
		<option value={themeName}>{themeName.charAt(0).toUpperCase() + themeName.slice(1)}</option>
	{/each}
</select>
