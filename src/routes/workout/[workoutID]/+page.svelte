<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { updateWorkout, type Workout } from '$lib/api/workouts';
  import { getExercise, getExercises, type Exercise } from '$lib/api/exercises';
  import DnDList from '$lib/components/DnDList.svelte';

  export let data;
  const { workout } = data;

  let workoutExercises: Exercise[] = [];
  let allExercises: Exercise[] = [];

  onMount(async () => {
    if (workout?.exercises) {
      workoutExercises = await Promise.all(workout.exercises.map(e => getExercise(e)));
    }
    allExercises = (await getExercises()).sort((a, b) => a.name.localeCompare(b.name));
    // Remove any that are already in the workout
    const workoutIds = new Set(workoutExercises.map(x => x.id));
    allExercises = allExercises.filter(x => !workoutIds.has(x.id));
  });

  function handleAllUpdate(e: CustomEvent<{ exercises: Exercise[] }>) {
    allExercises = e.detail.exercises;
  }

  function handleWorkoutUpdate(e: CustomEvent<{ exercises: Exercise[] }>) {
    workoutExercises = e.detail.exercises;
  }

  async function handleSubmit() {
    const updated: Partial<Workout> = { exercises: workoutExercises.map(x => x.id) };
    try {
      await updateWorkout(workout.id, updated);
      goto('/');
    } catch (error) {
      console.error('Failed to update workout:', error);
      alert('There was an error updating the workout. Please try again.');
    }
  }
</script>

{#if workout}
  <h1 class="text-4xl font-bold mb-6">{workout.groupName}</h1>
  <div class="grid grid-cols-2 gap-6">
    <!-- All Exercises -->
    <div class="border p-4 rounded shadow">
      <h2 class="text-2xl font-semibold mb-4 text-center">All Exercises</h2>
      <DnDList
        exercises={allExercises}
        type="exercise"
        on:update={handleAllUpdate}
      />
    </div>

    <!-- Workout Exercises -->
    <div class="border p-4 rounded shadow">
      <h2 class="text-2xl font-semibold mb-4 text-center">Workout Exercises</h2>
      <DnDList
        exercises={workoutExercises}
        type="exercise"
        on:update={handleWorkoutUpdate}
      />
    </div>
  </div>
  <button
    class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    on:click={handleSubmit}
  >
    Submit
  </button>
{/if}
