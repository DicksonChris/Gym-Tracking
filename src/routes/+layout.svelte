<script lang="ts">
	import '../app.css';
	import ThemeDropdown from '$lib/components/Header/ThemeDropdown.svelte';
	import Nav from '$lib/components/Header/Nav.svelte';
	import { page } from '$app/state';
	import NavAuth from '$lib/components/Header/NavAuth.svelte';
	import RestTimer from '$lib/components/RestTimer.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { flushQueue } from '$lib/offlineQueue';

	// Grab props using the new $props rune
	let { data, children } = $props();

	// Create a derived class based on the current pathname.
	let bgClass = $derived(page.url.pathname === '/' ? 'bg-black bg-opacity-50' : 'bg-base-100');

	// Declare isMobile as reactive state using the $state rune.
	let isMobile = $state(false);

	// Current theme. Follows the server value when it changes (e.g. after
	// login); otherwise only the dropdown updates it, so navigation and
	// component remounts can never snap it back.
	let theme = $state(data.theme ?? 'dracula');
	let lastServerTheme = data.theme;
	$effect(() => {
		if (data.theme && data.theme !== lastServerTheme) {
			lastServerTheme = data.theme;
			theme = data.theme;
		}
	});

	async function handleThemeChange(event: CustomEvent<string>) {
		const previous = theme;
		theme = event.detail;
		try {
			const res = await fetch('/api/theme', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ theme })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
		} catch (err) {
			console.error('Failed to save theme:', err);
			theme = previous;
		}
	}

	// Account menu: explicit state instead of daisyUI's focus-based dropdown,
	// which never opens on iOS Safari (buttons don't receive focus on tap).
	let menuOpen = $state(false);
	let menuContainer: HTMLElement | undefined = $state();

	function handleWindowClick(e: MouseEvent) {
		if (menuOpen && menuContainer && !menuContainer.contains(e.target as Node)) {
			menuOpen = false;
		}
	}

	onMount(() => {
		const updateWidth = () => {
			isMobile = window.innerWidth < 500;
		};
		updateWidth();
		window.addEventListener('resize', updateWidth);

		// sync any sets logged while offline
		flushQueue();
		window.addEventListener('online', flushQueue);

		return () => {
			window.removeEventListener('resize', updateWidth);
			window.removeEventListener('online', flushQueue);
		};
	});
</script>

<svelte:window onclick={handleWindowClick} />

<div
	class="min-h-screen bg-base-200 font-sans text-primary"
	data-theme={data.user ? theme : 'fantasy'}
>
	{#if data.user}
		<header
			class="fixed left-0 top-0 z-10 flex w-full justify-between {bgClass} p-4 pt-[calc(1rem+env(safe-area-inset-top))]"
		>
			<Nav />
			<span class="flex items-center space-x-2">
				{#if !isMobile}
					<ThemeDropdown {theme} on:change={handleThemeChange} />
				{/if}
				<div class="relative" bind:this={menuContainer}>
					<button
						class="flex pr-2"
						aria-label="Account menu"
						aria-expanded={menuOpen}
						onclick={() => (menuOpen = !menuOpen)}
					>
						<Icon icon="bi:person-circle" class="h-6 w-6 text-base-content" />
					</button>
					{#if menuOpen}
						<ul class="menu absolute right-0 top-8 z-50 w-48 rounded-box bg-base-100 p-2 shadow-lg">
							{#if isMobile}
								<li class="pointer-events-auto mb-2">
									<div class="flex flex-col items-stretch gap-1 p-1">
										<span class="text-xs font-semibold uppercase opacity-60">Theme</span>
										<ThemeDropdown {theme} block on:change={handleThemeChange} />
									</div>
								</li>
							{/if}
							<li>
								<form method="POST" action="/logout">
									<button type="submit" class="w-full text-left text-base-content">Logout</button>
								</form>
							</li>
						</ul>
					{/if}
				</div>
			</span>
		</header>
	{:else}
		<header
			class="fixed left-0 top-0 z-10 flex w-full justify-between p-4 pt-[calc(1rem+env(safe-area-inset-top))]"
		>
			<NavAuth />
		</header>
	{/if}
	<main class="container mx-auto">
		{@render children()}
	</main>
	{#if data.user}
		<RestTimer />
	{/if}
</div>
