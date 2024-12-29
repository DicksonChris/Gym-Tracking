<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Exercise } from '$lib/api/exercises';
  import type { History } from '$lib/api/history';

  export let exercise: Exercise;
  export let initialData: History | null = null;

  const dispatch = createEventDispatcher();

  let reps: number = initialData?.reps || 0;
  let weight: number = initialData?.weight || 0;
  let distance: string = initialData?.distance || '';
  let time: string = initialData?.time || '';

  function handleSubmit() {
    const historyData: Partial<History> = {
      reps: reps || undefined,
      weight: weight || undefined,
      distance: distance || undefined,
      time: time || undefined
    };
    dispatch('submit', historyData);
  }
</script>

{#if exercise}
  <h2 class="text-2xl">{initialData ? 'Update' : 'Create'} {exercise.name} History</h2>
  {#if initialData}
    <p>{new Date(initialData.startTime).toLocaleString()}</p>
  {/if}

  <form class="form-control" on:submit|preventDefault={handleSubmit}>
    {#if exercise.measurement?.includes('reps')}
      <div class="form-control">
        <label class="label" for="reps">Reps</label>
        <input class="input input-bordered" type="number" id="reps" bind:value={reps} required />
      </div>
    {/if}

    {#if exercise.measurement?.includes('weight')}
      <div class="form-control">
        <label class="label" for="weight">Weight</label>
        <input class="input input-bordered" type="number" id="weight" bind:value={weight} required />
      </div>
    {/if}

    {#if exercise.measurement?.includes('distance')}
      <div class="form-control">
        <label class="label" for="distance">Distance</label>
        <input class="input input-bordered" type="text" id="distance" bind:value={distance} required />
      </div>
    {/if}

    {#if exercise.measurement?.includes('time')}
      <div class="form-control">
        <label class="label" for="time">Time</label>
        <input class="input input-bordered" type="text" id="time" bind:value={time} required />
      </div>
    {/if}

    <button class="btn btn-primary mt-4" type="submit">
      {initialData ? 'Update' : 'Submit'}
    </button>
  </form>
{/if}