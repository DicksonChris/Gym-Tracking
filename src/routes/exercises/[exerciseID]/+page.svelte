<script lang="ts">
    import { goto } from '$app/navigation';
    import { type Exercise } from '$lib/api/exercises';
    import Icon from '@iconify/svelte';
    import Title from '$lib/components/Title.svelte';
    import { createNewExercise, saveExercise, loadMuscleGroups } from '$lib/stores/exercisesStore';
    import { onMount } from 'svelte';
    import { dndzone } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';

    export let data;

    let { exerciseID, exercise, muscleGroups } = data;
    let selectedMuscleGroups: string[] = exercise ? exercise.muscleGroup.split(', ').map(g => g.trim()) : [];
    let newMuscleGroup: string = '';

    let exerciseName: string = exercise ? exercise.name : '';
    let selectedMeasurements: string[] = exercise ? exercise.measurement : [];
    let defaultReps: number | null = exercise?.defaultReps || null;
    let defaultStep: number | null = exercise?.defaultStep || null;

    // Transform strings into objects with an "id"
    let items = selectedMuscleGroups.map(name => ({ id: name }));

    onMount(async () => {
        if (!muscleGroups || muscleGroups.length === 0) {
            muscleGroups = await loadMuscleGroups();
        }
    });

    // Reactive statements to reset defaults when measurements are deselected
    $: {
        if (!selectedMeasurements.includes('reps')) {
            defaultReps = null;
        }
        if (!selectedMeasurements.includes('weight')) {
            defaultStep = null;
        }
    }

    function syncItems() {
        items = selectedMuscleGroups.map(name => ({ id: name }));
    }

    function addMuscleGroup(group: string) {
        if (!selectedMuscleGroups.includes(group)) {
            selectedMuscleGroups = [...selectedMuscleGroups, group];
            syncItems();
        }
    }

    function removeMuscleGroup(name: string) {
        selectedMuscleGroups = selectedMuscleGroups.filter(m => m !== name);
        syncItems();
    }

    function addNewMuscleGroup() {
        const trimmedGroup = newMuscleGroup.trim();
        if (trimmedGroup && !muscleGroups.includes(trimmedGroup)) {
            muscleGroups = [...muscleGroups, trimmedGroup];
            selectedMuscleGroups = [...selectedMuscleGroups, trimmedGroup];
            syncItems();
            newMuscleGroup = '';
        }
    }

    function toggleMuscleGroup(group: string) {
        if (selectedMuscleGroups.includes(group)) {
            selectedMuscleGroups = selectedMuscleGroups.filter(g => g !== group);
        } else {
            selectedMuscleGroups = [...selectedMuscleGroups, group];
        }
        syncItems();
    }

    async function handleSubmit() {
        if (!exerciseName.trim()) {
            alert('Exercise name is required.');
            return;
        }

        const exerciseData: Partial<Exercise> = {
            name: exerciseName.trim(),
            muscleGroup: selectedMuscleGroups.join(', '),
            measurement: selectedMeasurements,
        };

        if (selectedMeasurements.includes('reps') && defaultReps !== null) {
            exerciseData.defaultReps = Math.round(defaultReps);
        }

        if (selectedMeasurements.includes('weight') && defaultStep !== null) {
            exerciseData.defaultStep = parseFloat(defaultStep.toFixed(1));
        }

        try {
            if (exerciseID === 'new') {
                await createNewExercise(exerciseData);
            } else {
                exerciseData.id = exerciseID;
                await saveExercise(exerciseData as Exercise);
            }
            goto('/exercises');
        } catch (error) {
            console.error('Error saving exercise:', error);
            alert('Failed to save exercise.');
        }
    }

    function handleConsider(e) {
        items = e.detail.items;
        selectedMuscleGroups = items.map(i => i.id);
    }

    function handleFinalize(e) {
        items = e.detail.items;
        selectedMuscleGroups = items.map(i => i.id);
    }
</script>

{#if exerciseID === 'new' || exercise}
  <Title title={exerciseID === 'new' ? 'Create New Exercise' : 'Edit Exercise'}/>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <!-- Exercise Name -->
    <div>
      <label class="label">Exercise Name</label>
      <input
        type="text"
        bind:value={exerciseName}
        placeholder="Enter exercise name"
        class="input-bordered input w-full"
        required
      />
    </div>
    <!-- Add New Muscle Group -->
    <div>
      <h2 class="text-lg font-semibold">Create New Muscle Group</h2>
      <div class="flex items-center gap-2">
        <input
          type="text"
          bind:value={newMuscleGroup}
          placeholder="Enter new muscle group"
          class="input-bordered input flex-1"
        />
        <button type="button" on:click={addNewMuscleGroup} class="btn btn-primary">
          Add
        </button>
      </div>
    </div>

    <!-- Available Muscle Groups Section -->
    <div>
      <h2 class="text-lg font-semibold">Add Muscle Groups</h2>
      <div class="flex flex-wrap gap-2 select-none">
        {#each muscleGroups as group}
          {#each group.split(',').map(g => g.trim()) as individualGroup}
            <span
              class="badge cursor-pointer transition-colors
                     {selectedMuscleGroups.includes(individualGroup) ? 'badge-accent' : 'text-neutral-content badge-outline'}"
              on:click={() => toggleMuscleGroup(individualGroup)}
            >
              {individualGroup}
            </span>
          {/each}
        {/each}
      </div>
    </div>

    <!-- Selected Muscle Groups -->
    {#if selectedMuscleGroups.length > 0}
      <div>
        <h3 class="text-md font-semibold">Selected Muscle Groups:</h3>
        <div
          use:dndzone="{{ items, flipDurationMs:300 }}"
          on:consider="{handleConsider}"
          on:finalize="{handleFinalize}"
          class="flex flex-wrap gap-2 bg-base-300 p-2 rounded-lg"
        >
          {#each items as group (group.id)}
            <span class="badge badge-primary select-none">
              {group.id}
              <button type="button" on:click={() => removeMuscleGroup(group.id)} class="ml-1">
                <Icon icon="bi:x" class="h-4 w-4" />
              </button>
            </span>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Measurements Section -->
    <div>
      <h2 class="text-lg font-semibold">Measurements</h2>
      <div class="flex flex-col gap-2">
        <!-- Reps -->
        <label class="flex items-center">
          <input
            type="checkbox"
            bind:group={selectedMeasurements}
            value="reps"
            class="checkbox"
          />
          <span class="ml-2">Reps</span>
        </label>
        {#if selectedMeasurements.includes('reps')}
          <div class="ml-6">
            <label class="label">Default Reps</label>
            <input
              type="number"
              bind:value={defaultReps}
              placeholder="Default Reps"
              class="input-bordered input w-full"
              min="1"
              step="1"
              required
            />
          </div>
        {/if}

        <!-- Weight -->
        <label class="flex items-center">
          <input
            type="checkbox"
            bind:group={selectedMeasurements}
            value="weight"
            class="checkbox"
          />
          <span class="ml-2">Weight</span>
        </label>
        {#if selectedMeasurements.includes('weight')}
          <div class="ml-6">
            <label class="label">Default Step (lbs)</label>
            <input
              type="number"
              bind:value={defaultStep}
              placeholder="Default Step"
              class="input-bordered input w-full"
              min="0"
              step="0.1"
              required
            />
          </div>
        {/if}

        <!-- Time -->
        <label class="flex items-center">
          <input
            type="checkbox"
            bind:group={selectedMeasurements}
            value="time"
            class="checkbox"
          />
          <span class="ml-2">Time</span>
        </label>

        <!-- Distance -->
        <label class="flex items-center">
          <input
            type="checkbox"
            bind:group={selectedMeasurements}
            value="distance"
            class="checkbox"
          />
          <span class="ml-2">Distance</span>
        </label>
      </div>
    </div>

    <!-- Submit Button -->
    <button
        type="submit"
        class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
    >
        <Icon icon="bi:check2" class="h-6 w-6" />
    </button>
  </form>
{/if}

<style>
  .badge {
    cursor: pointer;
  }
  .badge:hover {
    opacity: 0.8;
  }
</style>