<script lang="ts">
	import { onMount } from 'svelte';
	import PlusButton from './CreateSet.svelte';
	import HistoryList from '$lib/components/HistoryList.svelte';
	import { exercisesStore } from '$lib/stores/exercisesStore';
	import type { Exercise } from '$lib/api/exercises';
	import Icon from '@iconify/svelte';
	import ShinyTitle from '$lib/components/ShinyTitle.svelte';
	import ShinyButton from './ShinyButton.svelte';

	export let exerciseID: string;
	export let index: number;
	let showAll = false;
	let titleRowWidth = 0;

	// Reactive statement to get the exercise from the store
	$: exercise = $exercisesStore?.find((e) => e.id === exerciseID) ?? null;
</script>


{#if $exercisesStore === null}
	<li class="card bg-base-100 px-4 pb-4">
		<div class="mt-4 flex items-center justify-center">
			<span class="text-lg">Loading exercises...</span>
		</div>
	</li>
{:else if exercise && !exercise.hidden}
	<li class="card px-4 
	pb-4 {index === -1 ? 'rounded-t-none' : 'rounded-none'}">
		<div class="mt-4 flex items-center justify-between">
			<ShinyTitle>
				<div
					id="{exerciseID}-titleRow"
					bind:clientWidth={titleRowWidth}
					class="flex items-center overflow-hidden mr-auto"
				>
					<span
						class="mr-4 min-w-0 flex-grow overflow-hidden text-ellipsis text-[#09093b] whitespace-nowrap font-medium sm:text-lg md:text-xl"
					>
						{exercise.name}
					</span>
				</div>
				<ShinyButton size="small">
					<PlusButton {exerciseID} />
				</ShinyButton>
			</ShinyTitle>
			{#if exercise.url}
				<a
					href={exercise.url}
					target="_blank"
					rel="noopener noreferrer"
					class="link mr-2 text-base-content"
				>
					<Icon icon="line-md:link" class="h-6 w-6" />
				</a>
			{/if}
			<button
				class="w-8 flex-shrink-0 text-xl text-secondary"
				on:click={() => (showAll = !showAll)}
			>
				{#if showAll}
					<Icon icon="fe:drop-down" class="h-6 w-6" />
				{:else}
					<Icon icon="fe:drop-right" class="h-6 w-6" />
				{/if}
			</button>
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
	</li>
{/if}
