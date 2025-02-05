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

<nav>
	<div class="navbar-center text-slate-300">
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
				<!-- Empty spacer so the layout doesn't shift -->
				<li class="h-8 mr-4"></li>
			{/if}

			<!-- Logo/link to root -->
			<li class="mr-4">
				<a href="/">
					<img src="/images/GainsGalaxySMALL.png" alt="logo" width="80px" />
				</a>
			</li>

			<li class="mr-4">
				<!-- 'class:text-primary={condition}' toggles .text-primary if the condition is true -->
				<a
					href="/home"
					class="transition-colors hover:text-accent"
					class:text-accent={$page.url.pathname === '/home'}
				>
					Home
				</a>
			</li>

			<li class="mr-4">
				<a
					href="/home/workouts"
					class="transition-colors hover:text-accent"
					class:text-accent={$page.url.pathname === '/home/workouts'}
				>
					Workouts
				</a>
			</li>

			<li class="mr-4">
				<a
					href="/home/exercises"
					class="transition-colors hover:text-accent"
					class:text-accent={$page.url.pathname === '/home/exercises'}
				>
					Exercises
				</a>
			</li>
		</ul>
	</div>
</nav>
