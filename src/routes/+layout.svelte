<script lang="ts">
	import '../app.css';
	import ThemeDropdown from '$lib/components/Header/ThemeDropdown.svelte';
	import Nav from '$lib/components/Header/Nav.svelte';

	import NavAuth from '$lib/components/Header/NavAuth.svelte';
	import { themeStore } from '$lib/stores/themeStore';
	import Icon from '@iconify/svelte';

	let { data, children } = $props();
</script>

<div
	class="min-h-screen bg-base-200 font-sans text-primary"
	data-theme={data.user ? $themeStore : 'fantasy'}
>
	{#if data.user}
		<header class="fixed left-0 top-0 z-10 flex w-full justify-between bg-base-100 p-4">
			<Nav />
			<span class="flex items-center space-x-2">
				<ThemeDropdown initialTheme={data.theme} />
				<div class="dropdown dropdown-end">
					<button class="flex pr-2"
						><Icon icon="bi:person-circle" class="h-6 w-6 text-base-content" /></button
					>
					<ul class="z-100 menu dropdown-content rounded-box bg-base-100 p-2 shadow">
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
