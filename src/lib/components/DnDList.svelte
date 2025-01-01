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
    dropTargetStyle: { border: 'none' },
    dropTargetClasses: ['rounded-xl','bg-base-300']
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
	class="min-h-[200px] overflow-auto p-2 h-full"
>
	{#each exercises as exercise (exercise.id)}
		<div
			animate:flip={{ duration: flipDurationMs }}
			class="card my-2 cursor-grab border-2 border-base-200 bg-base-200 p-1 text-center shadow-sm hover:border-primary active:cursor-grabbing"
		>
			<span class="font-semibold text-base-content">{exercise.name}</span>
		</div>
	{/each}

	{#if exercises.length === 0}
		<div class="text-center text-gray-500">No exercises available.</div>
	{/if}
</section>
