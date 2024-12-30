<script lang="ts">
	import PlusButton from './CreateSet.svelte';
	import HistoryList from '$lib/components/HistoryList.svelte';
	import { exercisesStore } from '$lib/stores/exercisesStore';
	import { onMount } from 'svelte';
	import type { Exercise } from '$lib/api/exercises';
	import Icon from '@iconify/svelte';

	export let exerciseID: string;
	let showAll = false;

	// Reactive statement to get the exercise from the store
	$: exercise = $exercisesStore?.find((e) => e.id === exerciseID) ?? null;
</script>

{#if exercise}
	<li class="card bg-base-300 px-4 pb-4">
		<div class="mt-4 flex items-center justify-between">
			<div class="flex items-center">
				<span class="mr-4 inline-block whitespace-nowrap text-2xl font-medium text-base-content">
					{exercise.name}
				</span>
				<span class="badge badge-secondary text-sm mr-2">
					{exercise.muscleGroup}
				</span>
				<button class="w-8 text-xl" on:click={() => (showAll = !showAll)}>
					{#if showAll}
						<Icon icon="fe:drop-down" class="h-6 w-6" />
					{:else}
						<Icon icon="fe:drop-right" class="h-6 w-6" />
					{/if}
				</button>
			</div>

			<PlusButton {exerciseID} />
		</div>
		<hr class="my-2 border-primary" />
		<HistoryList {exerciseID} {showAll} />
	</li>
{:else}
	<li class="card bg-base-300 px-4 pb-4">
		<div class="mt-4 flex items-center justify-between">
			<span class="mr-4 inline-block whitespace-nowrap text-2xl font-medium text-base-content">
				Loading...
			</span>
			<PlusButton exerciseID="#" />
		</div>
		<hr class="my-2 border-primary" />
	</li>
{/if}
