<script lang="ts">
  import { onMount } from 'svelte';
  import { workoutsStore, loadWorkouts } from '$lib/stores/workoutsStore';
  import ExerciseItem from '$lib/components/ExerciseItem.svelte';

  let workouts = [];

  onMount(async () => {
    await loadWorkouts();
    $: workouts = $workoutsStore ?? [];
  });
</script>

<h1 class="mb-4 text-center text-4xl font-bold">Workouts</h1>
<ul class="space-y-6">
  {#each workouts as workout}
    <li class="card">
      <h2 class="card-title text-2xl font-bold mb-4">{workout.groupName}</h2>
      <ul class="space-y-4">
        {#if workout.exercises}
          {#each workout.exercises as exerciseID}
            <ExerciseItem {exerciseID} />
          {/each}
        {/if}
      </ul>
    </li>
  {/each}
</ul>
