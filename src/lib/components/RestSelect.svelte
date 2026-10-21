<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { REST_OPTIONS, fmtRest } from '$lib/rest';

	/** Effective rest setting: seconds, or REST_OFF. */
	export let value: number;
	export let id: string | undefined = undefined;
	export let disabled = false;

	const dispatch = createEventDispatcher<{ change: number }>();

	$: options = REST_OPTIONS.includes(value)
		? REST_OPTIONS
		: [...REST_OPTIONS, value].sort((a, b) => a - b);

	function handleChange(e: Event) {
		value = parseInt((e.currentTarget as HTMLSelectElement).value, 10);
		dispatch('change', value);
	}
</script>

<!-- full-size + leading-normal: smaller native selects clip / zoom on iOS -->
<select
	{id}
	{disabled}
	class="select select-bordered w-full leading-normal text-base-content"
	aria-label="Rest between sets"
	value={String(value)}
	on:change={handleChange}
>
	{#each options as s}
		<option value={String(s)}>Rest {fmtRest(s)}</option>
	{/each}
</select>
