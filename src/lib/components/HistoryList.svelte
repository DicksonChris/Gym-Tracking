<script lang="ts">
	import { onMount } from 'svelte';
	import { getHistoriesByExercise, type History } from '$lib/api/history';
	import HistoryItem from './HistoryItem.svelte';

	export let exerciseID: string;
	let historyList: History[] = [];
	let groupedHistory = {};

	onMount(async () => {
		historyList = await getHistoriesByExercise(exerciseID);
	});

	$: {
		groupedHistory = historyList.reduce((acc, history) => {
			const date = new Date(history.startTime).toLocaleDateString();
			if (!acc[date]) acc[date] = [];
			acc[date].push(history);
			return acc;
		}, {});

		// Sort dates in ascending order
		groupedHistory = Object.keys(groupedHistory)
			.sort((a, b) => new Date(a) - new Date(b))
			.reduce((acc, date) => {
				acc[date] = groupedHistory[date];
				return acc;
			}, {});
	}
</script>

<div class="overflow-x-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {#each Object.keys(groupedHistory) as date}
            <div class="card rounded-none">
                <h3 class="card-title text-center">{date}</h3>
                <ul class="bg-base-300 space-y-2">
                    {#each groupedHistory[date] as history}
                        <HistoryItem {history} />
                    {/each}
                </ul>
            </div>
        {/each}
    </div>
</div>

<!-- {#if historyList.length > 0}
	<table class="w-full table-auto border-collapse border border-slate-300">
		<thead>
			<tr>
				<th class="border border-slate-300 px-2 py-1">Date</th>
				<th class="border border-slate-300 px-2 py-1">Reps</th>
				<th class="border border-slate-300 px-2 py-1">Weight</th>
				<th class="border border-slate-300 px-2 py-1">Distance</th>
				<th class="border border-slate-300 px-2 py-1">Time</th>
			</tr>
		</thead>
		<tbody>
			{#each historyList as history}
				<HistoryItem {history} />
			{/each}
		</tbody>
	</table>
{:else}
	<p>No history entries found.</p>
{/if}
<br /> -->


