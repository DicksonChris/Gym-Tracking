<script lang="ts">
    import { onMount } from 'svelte';
    import { getHistoriesByExercise, type History } from '$lib/api/history';
    import HistoryItem from './HistoryItem.svelte';

    export let exerciseID: string;
    let historyList: History[] = [];

    onMount(async () => {
        historyList = await getHistoriesByExercise(exerciseID);
    });
</script>

{#if historyList.length > 0}
    <table class="table-auto w-full border-collapse border border-slate-300">
        <thead>
            <tr>
                <th class="border border-slate-300 px-2 py-1">ID</th>
                <th class="border border-slate-300 px-2 py-1">Reps</th>
                <th class="border border-slate-300 px-2 py-1">Weight</th>
                <th class="border border-slate-300 px-2 py-1">Distance</th>
                <th class="border border-slate-300 px-2 py-1">Time</th>
                <th class="border border-slate-300 px-2 py-1">Start Time</th>
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
<br />
