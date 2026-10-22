<script lang="ts">
	import Icon from '@iconify/svelte';
	import { DEFAULT_REST, REST_MAX, REST_MIN, REST_OFF, REST_STEP, fmtDuration } from '$lib/rest';

	/** Seconds, or REST_OFF. */
	export let value: number;
	export let id = 'rest';

	let lastOn = value > 0 ? value : DEFAULT_REST;
	$: if (value > 0) lastOn = value;

	$: enabled = value !== REST_OFF;

	function toggle() {
		value = enabled ? REST_OFF : lastOn;
	}

	function step(delta: number) {
		value = Math.min(REST_MAX, Math.max(REST_MIN, value + delta));
	}
</script>

<div class="flex flex-wrap items-center gap-4">
	<label class="flex cursor-pointer items-center gap-2" for={id}>
		<input {id} type="checkbox" class="toggle toggle-primary" checked={enabled} on:change={toggle} />
		<span class="text-base-content">{enabled ? 'On' : 'Off'}</span>
	</label>
	{#if enabled}
		<div class="join">
			<button
				type="button"
				class="btn join-item"
				aria-label="Decrease rest by 15 seconds"
				disabled={value <= REST_MIN}
				on:click={() => step(-REST_STEP)}
			>
				<Icon icon="bi:dash-lg" class="h-4 w-4" />
			</button>
			<span
				class="join-item flex min-w-[5rem] items-center justify-center bg-base-100 font-mono text-lg font-bold text-base-content"
			>
				{fmtDuration(value)}
			</span>
			<button
				type="button"
				class="btn join-item"
				aria-label="Increase rest by 15 seconds"
				disabled={value >= REST_MAX}
				on:click={() => step(REST_STEP)}
			>
				<Icon icon="bi:plus-lg" class="h-4 w-4" />
			</button>
		</div>
	{/if}
</div>
