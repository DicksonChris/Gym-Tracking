<script lang="ts">
	import GainsGalaxyImage from '$lib/components/Logo/GainsGalaxyImage.svelte';
	import SpiralGalaxyMask from '$lib/components/Logo/SpiralGalaxyMask.svelte';
	import SwirlingStars from '$lib/components/Logo/SwirlingStarsHero.svelte';

	export let data;
	let { isUser } = data;
	
</script>

<!-- Full-viewport hero: the spiral + purple background always cover the
     visible window, and the auth buttons overlay the bottom of the hero. -->
<div class="full-bleed relative h-svh overflow-hidden bg-primary">
	<SpiralGalaxyMask>
		<SwirlingStars bg="black" />
	</SpiralGalaxyMask>
	<GainsGalaxyImage />

	{#if !isUser}
		<!-- Scrim so the buttons read clearly against the busy artwork -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-44 bg-gradient-to-t from-black/70 via-black/35 to-transparent"
		></div>
		<div
			class="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-md gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
		>
			<a
				class="btn btn-primary btn-lg flex-1 shadow-lg shadow-black/60 ring-1 ring-white/40"
				href="/login">Login</a
			>
			<a
				class="btn btn-secondary btn-lg flex-1 shadow-lg shadow-black/60 ring-1 ring-white/40"
				href="/register">Register</a
			>
		</div>
	{/if}
</div>

<style>
	/* Break out of the layout container to span the full viewport width. */
	.full-bleed {
		width: 100vw;
		margin-left: calc(50% - 50vw);
	}
</style>
