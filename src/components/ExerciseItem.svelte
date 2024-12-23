<script>
    import ExerciseHistory from './ExerciseHistory.svelte';
    import { exercisesStore, historyStore } from '$lib/stores';

    export let exerciseId;
    $: exData = $exercisesStore;
    $: histData = $historyStore;
</script>

<li class="flex flex-col">
    <div class="flex justify-between items-center">
        <span>
            <span class="mr-4 inline-block whitespace-nowrap text-lg font-medium text-base-content">
                {exData[exerciseId]?.name}
            </span>
            <span class="whitespace-nowraptext-base-content badge badge-secondary text-sm">
                {exData[exerciseId]?.muscleGroup}
            </span>
        </span>
        <button class="btn btn-circle btn-accent btn-sm m-4 text-white">
            <!-- svg for plus sign -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
            </svg>
        </button>
    </div>
    {#if histData[exerciseId]}
        <ExerciseHistory history={histData[exerciseId]} />
    {/if}
</li>
