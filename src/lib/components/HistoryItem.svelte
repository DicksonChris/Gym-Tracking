<script lang="ts">
    import type { History } from '$lib/api/history';
    import Icon from '@iconify/svelte';
    import { browser } from '$app/environment';
    export let history: History;

    // Primary/secondary display values depending on what was tracked.
    $: first = history.reps
        ? history.weight
            ? `${history.reps}`
            : `${history.reps} reps`
        : history.time
          ? `${history.time} min`
          : history.weight
            ? `${history.weight} lbs`
            : (history.distance ?? '');
    $: second =
        history.reps && history.weight
            ? `${history.weight} lbs`
            : history.time && history.distance
              ? `${history.distance}`
              : '';
</script>

<svelte:head>
    <link rel="preload" href="https://api.iconify.design/maki/cross.svg" as="image" type="image/svg+xml">
</svelte:head>

<a
    class="flex overflow-clip whitespace-nowrap border-[1px] border-base-100 text-lg text-base-content hover:border-[1px] hover:border-secondary hover:bg-secondary hover:bg-opacity-20"
    href="/home/exercise/{history.exercise}/history/{history.id}"
>
    <div class="flex flex-nowrap items-center py-2">
        <div class="cursor-pointer px-1">
            <p>{first}</p>
        </div>
        {#if second}
            {#if history.reps && history.weight}
                {#if browser}
                    <Icon icon="maki:cross" class="px-[3px]" />
                {:else}
                    <span class="px-[4px]">×</span>
                {/if}
            {/if}
            <div class="cursor-pointer px-1">
                <p>{second}</p>
            </div>
        {/if}
        {#if history.note}
            <Icon icon="mdi:note-text-outline" class="ml-1 h-3.5 w-3.5 opacity-60" />
        {/if}
    </div>
</a>
