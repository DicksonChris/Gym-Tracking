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
