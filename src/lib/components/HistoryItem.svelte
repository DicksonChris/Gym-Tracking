<script lang="ts">
    import type { History } from '$lib/api/history';
    import Icon from '@iconify/svelte';
    import { browser } from '$app/environment';
    export let history: History;
</script>

<svelte:head>
    <link rel="preload" href="https://api.iconify.design/maki/cross.svg" as="image" type="image/svg+xml">
</svelte:head>

<a
    type="button"
    class="flex overflow-clip whitespace-nowrap border-[1px] border-base-100 text-lg text-base-content hover:border-[1px] hover:border-secondary hover:bg-secondary hover:bg-opacity-20"
    href="/exercise/{history.exercise}/history/{history.id}"
>
    {#if history.reps && history.weight}
        <div class="py-2 flex flex-nowrap items-center">
            <div class="cursor-pointer px-1">
                <p class="">
                    {history.reps ? `${history.reps} ` : `${history.time} min`}
                </p>
            </div>
            {#if browser}
                <Icon icon="maki:cross" class="px-[3px]" />
            {:else}
                <span class="px-[4px]">×</span>
            {/if}
            <div class="cursor-pointer px-1">
                <p class="">
                    {history.reps ? `${history.weight} lbs` : `${history.distance}`}
                </p>
            </div>
        </div>
    {:else}
        <li class="flex-1 cursor-pointer px-1 py-2">
            <p class="">
                {history.reps ? `${history.reps} ` : `${history.time} min`}
            </p>
        </li>
        <li class="flex-1 cursor-pointer px-1 py-2">
            <p class="">
                {history.reps ? `${history.weight} lbs` : `${history.distance}`}
            </p>
        </li>
    {/if}
</a>
