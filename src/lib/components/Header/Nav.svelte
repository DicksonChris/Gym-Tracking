<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	// Derived store to determine if the current path is not '/'
	const showBackButton = derived(page, ($page) => $page.url.pathname !== '/');

	// Function to navigate back to the previous page
	function goBack() {
		window.history.back();
	}
</script>

<nav class="">
	<div class="navbar-center text-slate-300">
		<ul class="flex items-center space-x-4">
			{#if $showBackButton}
				<li>
					<button
						on:click={goBack}
						class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-primary"
						aria-label="Go back"
					>
						<!-- Inline SVG for Left Arrow Icon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-primary-content"
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

			<li>
				<a href="/" class="transition-colors hover:text-accent">Home</a>
			</li>
			<li>
				<a href="/workouts" class="transition-colors hover:text-accent"
					>Workouts</a
				>
			<li>
				<a href="/exercises" class="transition-colors hover:text-accent"
					>Exercises</a
				>
			</li>
		</ul>
	</div>
</nav>
