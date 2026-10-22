<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon = 'bi:plus-lg';
	export let label: string;
	export let type: 'button' | 'submit' = 'button';
	export let disabled = false;
</script>

<!-- Single source of truth for floating action buttons: bottom-right, clear of the iOS home indicator. -->
<button
	{type}
	{disabled}
	aria-label={label}
	title={label}
	class="btn btn-circle btn-primary btn-lg fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-40 shadow-lg shadow-black/40 hover:btn-neutral hover:text-primary"
	on:click
>
	<Icon {icon} class="h-6 w-6" />
</button>
