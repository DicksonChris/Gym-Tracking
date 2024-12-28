<script lang="ts">
  import PlusButton from './CreateSet.svelte';

	import { onMount } from 'svelte';
	import { getExercise, type Exercise } from '$lib/api/exercises';
	import HistoryList from '$lib/components/HistoryList.svelte';
	export let exerciseID: string;

	let exercise: Exercise | null = null;

	onMount(async () => {
		exercise = await getExercise(exerciseID);
	});
</script>

{#if exercise}
	<li class="card bg-base-300 px-4 pb-4 flex flex-col">
		<div class="flex items-center justify-between">
			<span>
				<span class="inline-block whitespace-nowrap text-lg font-medium text-base-content">
					{exercise.name}
				</span>
				<span class="whitespace-nowraptext-base-content badge badge-secondary text-sm">
					{exercise.muscleGroup}
				</span>
			</span>
			<PlusButton {exerciseID} />
		</div>

		<HistoryList {exerciseID} />
	</li>
{:else}
	<p>Loading...</p>
{/if}
