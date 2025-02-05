<script lang="ts">
	import GainsGalaxyImage from '$lib/components/Logo/GainsGalaxyImage.svelte';
	import SpiralGalaxyMask from '$lib/components/Logo/SpiralGalaxyMask.svelte';
	import SwirlingStars from '$lib/components/Logo/SwirlingStarsHero.svelte';
	import { onMount } from 'svelte';

	export let data;
	let { isUser } = data;
	
</script>

<div class="w-100vw relative h-[500px] max-h-[50vw]">
	<div class="absolute-full-width-background z-0 bg-primary"></div>
	<SpiralGalaxyMask>
		<SwirlingStars
			height={'500px'}
			bg="linear-gradient(135deg, #000, #fff)
burnColors={['rgba(255, 200, 100, 0.8)', 'rgba(255, 50, 50, 0.8)', 'rgba(100, 100, 255, 0.8)']}
"
		></SwirlingStars>
	</SpiralGalaxyMask>
	<GainsGalaxyImage/>
</div>

{#if !isUser}
	<span class="flex flex-row gap-2 mt-2">
		<a class="btn btn-primary btn-lg flex-1" href="/login">Login</a>
		<a class="btn btn-secondary btn-lg flex-1" href="/register">Register</a>
	</span>
{/if}

<style>
	.absolute-full-width-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 200vw;
		height: 100%;
		margin-left: -100%;
	}
</style>
