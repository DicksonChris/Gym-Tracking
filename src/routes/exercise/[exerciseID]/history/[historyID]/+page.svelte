<script lang="ts">
  import HistoryForm from '$lib/components/HistoryForm.svelte';
  import { updateHistory, type History } from '$lib/api/history';
  import { getExercise, type Exercise } from '$lib/api/exercises';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;
  const { exerciseID, history } = data;
  let exercise: Exercise;

  onMount(async () => {
    exercise = await getExercise(exerciseID);
  });

  async function handleSubmit(e: CustomEvent<Partial<History>>) {
    await updateHistory(history.id, e.detail);
    goto(`/`);
  }
</script>

{#if exercise && history}
  <HistoryForm {exercise} initialData={history} on:submit={handleSubmit} />
{/if}