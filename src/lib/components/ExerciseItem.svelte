<script lang="ts">
	import { onMount } from 'svelte';
	import PlusButton from './CreateSet.svelte';
	import HistoryList from '$lib/components/HistoryList.svelte';
	import { exercisesStore, loadExercises } from '$lib/stores/exercisesStore';
	import type { Exercise } from '$lib/api/exercises';
	import Icon from '@iconify/svelte';

	export let exerciseID: string;
	export let index: number;
	let showAll = false;

	// Reactive statement to get the exercise from the store
	$: exercise = $exercisesStore?.find((e) => e.id === exerciseID) ?? null;

	// Reactive statement to get width of {exerciseID}-titleRow
	$: titleRowWidth = document.getElementById(`${exerciseID}-titleRow`)?.clientWidth ?? 0;

	onMount(async () => {
		if (!$exercisesStore) {
			await loadExercises();
		}
	});
</script>

{#if $exercisesStore === null}
	<li class="card bg-base-100 px-4 pb-4">
		<div class="mt-4 flex items-center justify-center">
			<span class="text-lg">Loading exercises...</span>
		</div>
	</li>
{:else if exercise && !exercise.hidden}
	<li class="card bg-base-100 px-4 pb-4 {index === -1 ? 'rounded-t-none' : 'rounded-none'}">
		<div class="mt-4 flex items-center justify-between">
			<div id="{exerciseID}-titleRow" class="flex items-center overflow-hidden">
				<span
					class="mr-4 min-w-0 flex-grow overflow-hidden text-ellipsis whitespace-nowrap sm:text-lg md:text-xl font-medium text-white"
				>
					{exercise.name}
				</span>
				<button class="w-8 text-xl flex-shrink-0 text-secondary" on:click={() => (showAll = !showAll)}>
					{#if showAll}
						<Icon icon="fe:drop-down" class="h-6 w-6" />
					{:else}
						<Icon icon="fe:drop-right" class="h-6 w-6" />
					{/if}
				</button>
			</div>
			<PlusButton {exerciseID} />
		</div>
		<HistoryList {exerciseID} {showAll} muscleGroups={exercise?.muscleGroup.split(', ') ?? []} />
	</li>
{:else if exercise && exercise.hidden}
	<!-- Handle hidden exercise if needed -->
{:else}
	<li class="card bg-base-100 px-4 pb-4">
		<div class="mt-4 flex items-center justify-between">
			<span class="mr-4 inline-block whitespace-nowrap text-2xl font-medium text-base-content">
				Loading...
			</span>
			<PlusButton exerciseID="#" />
		</div>
		<hr class="my-2 border-grey" />
	</li>
{/if}
