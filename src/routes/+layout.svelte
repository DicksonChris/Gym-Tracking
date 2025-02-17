<script lang="ts">
	import '../app.css';
	import ThemeDropdown from '$lib/components/Header/ThemeDropdown.svelte';
	import Nav from '$lib/components/Header/Nav.svelte';
	import { page } from '$app/state';
	import NavAuth from '$lib/components/Header/NavAuth.svelte';
	import { themeStore } from '$lib/stores/themeStore';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	// Grab props using the new $props rune
	let { data, children } = $props();

	// Create a derived class based on the current pathname.
	let bgClass = $derived(page.url.pathname === '/' ? 'bg-black bg-opacity-50' : 'bg-base-100');

	// Declare isMobile as reactive state using the $state rune.
	let isMobile = $state(false);

	onMount(() => {
		const updateWidth = () => {
			isMobile = window.innerWidth < 500;
		};
		updateWidth();
		window.addEventListener('resize', updateWidth);
		return () => window.removeEventListener('resize', updateWidth);
	});
</script>

<div
	class="min-h-screen bg-base-200 font-sans text-primary"
	data-theme={data.user ? $themeStore : 'fantasy'}
>
	{#if data.user}
		<header class="fixed left-0 top-0 z-10 flex w-full justify-between {bgClass} p-4">
			<Nav />
			<span class="flex items-center space-x-2">
				{#if !isMobile}
					<ThemeDropdown initialTheme={data.theme} />
				{/if}
				<div class="dropdown dropdown-end">
					<button class="flex pr-2">
						<Icon icon="bi:person-circle" class="h-6 w-6 text-base-content" />
					</button>
					<ul class="z-100 menu dropdown-content rounded-box bg-base-100 p-2 shadow">
						{#if isMobile}
							<li>
								<ThemeDropdown initialTheme={data.theme} />
							</li>
						{/if}
						<li>
							<a href="/logout" class="menu-title text-base-content">Logout</a>
						</li>
					</ul>
				</div>
			</span>
		</header>
	{:else}
		<header class="fixed left-0 top-0 z-10 flex w-full justify-between p-4">
			<NavAuth />
		</header>
	{/if}
	<main class="container mx-auto">
		{@render children()}
	</main>
</div>
