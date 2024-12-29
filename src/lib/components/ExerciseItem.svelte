<script lang="ts">
	import PlusButton from './CreateSet.svelte';

	import { onMount } from 'svelte';
	import { getExercise, type Exercise } from '$lib/api/exercises';
	import HistoryList from '$lib/components/HistoryList.svelte';
	export let exerciseID: string;

	let exercise: Exercise | null = null;

	let showAll = false;

	onMount(async () => {
		exercise = await getExercise(exerciseID);
	});
</script>

{#if exercise}
	<li class="card bg-base-300 px-4 pb-4">
		<div class="mt-4 flex items-center justify-between">
			<span>
				<span class="mr-4 inline-block whitespace-nowrap text-2xl font-medium text-base-content">
					{exercise.name}
				</span>

				<span class="whitespace-nowraptext-base-content badge badge-secondary text-sm">
					{exercise.muscleGroup}
				</span>
				<!-- Button that shows all, closed eye open eye prevent clicking and dragging-->
				<button class="w-8 text-xl"
					on:click={() => {
						showAll = !showAll;
					}} >
					{#if showAll} 
					🞃
					{:else} 
					🞂
					{/if}
				</button>
				
			</span>

			<PlusButton {exerciseID} />
		</div>

		<hr class="my-2 border-primary" />

		<HistoryList {exerciseID} {showAll} />
	</li>
{:else}
	<p>Loading...</p>
{/if}
