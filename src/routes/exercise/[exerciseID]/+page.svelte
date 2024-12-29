<script lang="ts">
  import HistoryForm from '$lib/components/HistoryForm.svelte';
  import { createHistory, type History } from '$lib/api/history';
  import { getExercise, type Exercise } from '$lib/api/exercises';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;
  const exerciseID = data.slug;
  let exercise: Exercise;

  onMount(async () => {
    exercise = await getExercise(exerciseID);
  });

  async function handleSubmit(e: CustomEvent<Partial<History>>) {
    await createHistory({ exercise: exerciseID, startTime: new Date().toISOString(), ...e.detail });
    goto('/');
  }
</script>

{#if exercise}
  <HistoryForm {exercise} on:submit={handleSubmit} />
{/if}
