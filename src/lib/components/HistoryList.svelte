<script lang="ts">
	import { onMount } from 'svelte';
	import { getHistoriesByExercise, type History } from '$lib/api/history';
	import HistoryItem from './HistoryItem.svelte';

	export let showAll = false;
	export let exerciseID: string;
	let historyList: History[] = [];
	let groupedHistory: Record<string, Record<string, History[]>> = {}

	// Fetch and sort history items on component mount
	onMount(async () => {
		try {
			historyList = await getHistoriesByExercise(exerciseID);
			// Sort historyList by startTime ascending
			historyList.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
		} catch (error) {
			console.error('Error fetching histories:', error);
		}
	});

	// Function to get abbreviated day of the week
	function getDayOfWeek(dateString) {
		return new Date(dateString).toLocaleString('default', { weekday: 'short' }).toUpperCase();
	}

	// Reactive statement to group history items by month and day
	$: {
		groupedHistory = historyList.reduce(
			(acc, history) => {
				const dateObj = new Date(history.startTime);
				const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase(); // "DEC"
				const year = dateObj.getFullYear();
				const day = dateObj.getDate().toString();
				const monthKey = `${month} ${year}`; // e.g., "DEC 2024"

				if (!acc[monthKey]) acc[monthKey] = {};
				if (!acc[monthKey][day]) acc[monthKey][day] = [];
				acc[monthKey][day].push(history);
				return acc;
			},
			{} as Record<string, Record<string, History[]>>
		);
	}
</script>

<div class="history-list">
	{#each showAll ? Object.keys(groupedHistory).reverse() : Object.keys(groupedHistory).reverse().slice(0,1) as monthKey}
		<div class="month-group mb-6">
			<!-- Display Month Header -->
			<h2 class="mb-4 text-2xl font-bold uppercase">{monthKey}</h2>
			<div class="grid grid-cols-3 gap-2">
				{#each showAll ? Object.keys(groupedHistory[monthKey]).reverse() : Object.keys(groupedHistory[monthKey]).reverse().slice(0,3) as dayKey}
					<div class="day-group">
						<!-- Display Day Header with Day of the Week -->
						<h3 class="mb-2 text-center text-lg font-semibold border-b-[1px] border-neutral-content">
							{getDayOfWeek(groupedHistory[monthKey][dayKey][0].startTime)} {dayKey}
						</h3>

						<!-- List of History Items for the Day -->
						<ul class="bg-base-300">
							{#each groupedHistory[monthKey][dayKey] as history}
								<HistoryItem {history} />
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
