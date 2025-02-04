<script lang="ts">
	import SwirlingStars from '$lib/components/SwirlingStarsHero.svelte';
	import { onMount } from 'svelte';

	export let data;
	let { isUser } = data;

	onMount(() => {
		const computedStyles = getComputedStyle(document.querySelector(':root')!);
		const primaryColor = `hsl(${computedStyles.getPropertyValue('--p')})`;
		const primaryFocusColor = computedStyles.getPropertyValue('--pf');
		const primaryContentColor = computedStyles.getPropertyValue('--pc');

		const secondaryColor = computedStyles.getPropertyValue('--s');
		const secondaryFocusColor = computedStyles.getPropertyValue('--sf');
		const secondaryContentColor = computedStyles.getPropertyValue('--sc');

		const accentColor = computedStyles.getPropertyValue('--a');
		const accentFocusColor = computedStyles.getPropertyValue('--af');
		const accentContentColor = computedStyles.getPropertyValue('--ac');

		const neutralColor = computedStyles.getPropertyValue('--n');
		const neutralFocusColor = computedStyles.getPropertyValue('--nf');
		const neutralContentColor = computedStyles.getPropertyValue('--nc');

		const base100Color = computedStyles.getPropertyValue('--b1');
		const base200Color = computedStyles.getPropertyValue('--b2');
		const base300Color = computedStyles.getPropertyValue('--b3');
		const baseContentColor = computedStyles.getPropertyValue('--bc');

		const infoColor = computedStyles.getPropertyValue('--in');
		const infoContentColor = computedStyles.getPropertyValue('--inc');

		const successColor = computedStyles.getPropertyValue('--su');
		const successContentColor = computedStyles.getPropertyValue('--suc');

		const warningColor = computedStyles.getPropertyValue('--wa');
		const warningContentColor = computedStyles.getPropertyValue('--wac');

		const errorColor = computedStyles.getPropertyValue('--er');
		const errorContentColor = computedStyles.getPropertyValue('--erc');
		console.log(primaryColor);
	});
</script>

<SwirlingStars
	height={'500px'}
	bg="linear-gradient(135deg, #000, #fff)
burnColors={['rgba(255, 200, 100, 0.8)', 'rgba(255, 50, 50, 0.8)', 'rgba(100, 100, 255, 0.8)']}
"
>
	<img src="/images/GainsGalaxy.app.png" alt="logo" width="400px" />
</SwirlingStars>
{#if !isUser}
	<span class="flex flex-row gap-2 mt-2">
		<a class="btn btn-lg btn-primary flex-1" href="/login">Login</a>
		<a class="btn btn-lg btn-secondary flex-1" href="/register">Register</a>
	</span>
{/if}
