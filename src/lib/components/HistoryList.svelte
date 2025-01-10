<script lang="ts">
	import { onMount } from 'svelte';
	import { historiesStore, loadHistories } from '$lib/stores/historiesStore';
	import HistoryItem from './HistoryItem.svelte';
	import { derived } from 'svelte/store';
	import type { History } from '$lib/api/history';

	export let showAll = false;
	export let exerciseID: string;
	export let muscleGroups: string[];

	let badgeClasses = "badge badge-neutral border-accent select-none"

	// Load histories on mount
	onMount(() => {
		loadHistories(exerciseID);
	});

	// Derived store to get histories for the specific exerciseID
	const exerciseHistories = derived(historiesStore, ($store) => $store[exerciseID] || []);

	let groupedHistory: Record<string, Record<string, History[]>> = {};

	// Subscribe to derived store
	exerciseHistories.subscribe((histories) => {
		groupedHistory = histories.reduce(
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
	});

	// Function to get abbreviated day of the week
	function getDayOfWeek(dateString: string) {
		return new Date(dateString).toLocaleString('default', { weekday: 'short' }).toUpperCase();
	}
</script>

{#if Object.keys(groupedHistory).length > 0}
	<hr class= />
{:else}
	<hr class="border-grey my-2" />
{/if}

<div class="history-list">
	{#if Object.keys(groupedHistory).length === 0}
		<div class="mt-[6px] flex flex-row gap-2">
			{#each muscleGroups as muscleGroup}
				<span class="{badgeClasses} text-nowrap text-sm">
					{muscleGroup}
				</span>
			{/each}
		</div>
	{/if}
	{#if Object.keys(groupedHistory).length > 0}
		{#each showAll ? Object.keys(groupedHistory).reverse() : Object.keys(groupedHistory)
					.reverse()
					.slice(0, 1) as monthKey, index}
			<div class="month-group">
				<div class="flex flex-row">
					<!-- Display Month Header -->
					<h2 class="mb-4 mr-4 text-nowrap text-2xl font-bold uppercase text-base-content">{monthKey}</h2>
					{#if index === 0}
						<!-- Display Muscle Groups -->
						<div class="mt-[6px] flex flex-row gap-2">
							{#each muscleGroups as muscleGroup}
								<span class="{badgeClasses} text-nowrap text-sm">
									{muscleGroup}
								</span>
							{/each}
						</div>
					{/if}
				</div>

				<div class="grid grid-cols-3 gap-2">
					{#each showAll ? Object.keys(groupedHistory[monthKey]).reverse() : Object.keys(groupedHistory[monthKey])
								.reverse()
								.slice(0, 3) as dayKey}
						<div class="day-group">
							<!-- Display Day Header with Day of the Week -->
							<h3 class="mb-2 border-b-[1px] border-white font-semibold">
								<span class="text-sm"
									>{getDayOfWeek(groupedHistory[monthKey][dayKey][0].startTime)}</span
								><span class="inline-block w-2"></span><span class="text-2xl text-base-content"
									>{dayKey}</span
								>
							</h3>

							<!-- List of History Items for the Day -->
							<ul>
								{#each groupedHistory[monthKey][dayKey] as history}
									<HistoryItem {history} />
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>
