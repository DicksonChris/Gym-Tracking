<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	// Derived store to determine if the current path is not '/'
	const showBackButton = derived(page, ($page) =>
		$page.url.pathname !== '/' ? $page.url.pathname !== '/home' : false
	);

	// Function to navigate back to the previous page
	function goBack() {
		if (browser) {
			window.history.back();
		}
	}
</script>

<nav class="w-full text-slate-300">
	<ul class="flex items-center">
		{#if $showBackButton}
			<li class="mr-4">
				<button
					on:click={goBack}
					class="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-primary"
					aria-label="Go back"
				>
					<!-- Inline SVG for Left Arrow Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			</li>
		{:else}
			<li class="h-8"></li>
		{/if}
		<li class="mr-4">
			<a href="/"><img src="/images/GainsGalaxySMALL.png" alt="logo" width="80px" /></a>
		</li>
		<li class="ml-auto">
			<a href="/login" class="transition-colors hover:text-accent">Login</a>
		</li>
	</ul>
</nav>
