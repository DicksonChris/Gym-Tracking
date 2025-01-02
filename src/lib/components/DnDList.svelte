<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { createEventDispatcher } from 'svelte';
	import type { Exercise } from '$lib/api/exercises';

	const flipDurationMs = 100;

	export let exercises: Exercise[] = [];
	export let type: string = 'exercise';

	const dispatch = createEventDispatcher();

	function handleDndConsider(e: CustomEvent) {
		dispatch('update', { exercises: e.detail.items });
	}

	function handleDndFinalize(e: CustomEvent) {
		dispatch('update', { exercises: e.detail.items });
	}
</script>

<section
	use:dndzone={{
		items: exercises,
		flipDurationMs,
		type,
		zoneTabIndex: 0,
		dropTargetStyle: { borderColor: 'var(--color-primary-100)' },
    dropTargetClasses: ['border-[1px]', 'border-primary', 'border-solid']
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
	class="bg-base-300 rounded-xl  border-[1px] border-base-300 border-solid flex-grow"
>
	{#each exercises as exercise (exercise.id)}
		<div
			animate:flip={{ duration: flipDurationMs }}
			class="rounded-md my-1 mx-1 cursor-grab border-2 border-base-200 bg-white bg-opacity-5 p-1 pl-2 shadow-sm hover:border-primary active:cursor-grabbing"
		>
			<span class="font-semibold text-base-content text-nowrap overflow-ellipsis overflow-clip">{exercise.name}</span>
		</div>
	{/each}

	{#if exercises.length === 0}
		<div class="text-center text-gray-500">No exercises available.</div>
	{/if}
</section>
