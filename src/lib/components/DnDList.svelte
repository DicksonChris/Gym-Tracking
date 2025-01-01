<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import { createEventDispatcher } from 'svelte';
  import type { Exercise } from '$lib/api/exercises';

  const flipDurationMs = 100;

  export let exercises: Exercise[] = [];
  export let type: string = 'exercise';

  const dispatch = createEventDispatcher();

  function handleDndConsider(e: CustomEvent) {
    dispatch('update', { exercises: e.detail.items });
  }

  function handleDndFinalize(e: CustomEvent) {
    dispatch('update', { exercises: e.detail.items });
  }
</script>

<style>
  /* Optional: Customize the placeholder appearance */
  .placeholder {
    @apply border-dashed border-2 border-primary rounded-lg;
  }
</style>

<section
  use:dndzone={{
    items: exercises,
    flipDurationMs,
    type,
    zoneTabIndex: 0,
    dropTargetClasses: ['placeholder']
  }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
  class="min-h-[200px] p-2 overflow-auto"
>
  {#each exercises as exercise (exercise.id)}
    <div
      animate:flip={{ duration: flipDurationMs }}
      class="card bg-base-200 border-base-200 my-2 p-1 text-center shadow-sm cursor-grab active:cursor-grabbing border-2 hover:border-primary"
    >
      
        <span class="font-semibold text-base-content">{exercise.name}</span>
      
    </div>
  {/each}

  {#if exercises.length === 0}
    <div class="text-center text-gray-500">No exercises available.</div>
  {/if}
</section>
