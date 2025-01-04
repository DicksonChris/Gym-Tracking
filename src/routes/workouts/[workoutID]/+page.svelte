<script lang="ts">
    import { goto } from '$app/navigation';
    import { type Workout } from '$lib/api/workouts';
    import { type Exercise } from '$lib/api/exercises';
    import { createNewWorkout, saveWorkout } from '$lib/stores/workoutsStore';
    import DnDList from '$lib/components/DnDList.svelte';
    import Icon from '@iconify/svelte';
    import Title from '$lib/components/Title.svelte';
    export let data;

    let { workoutID, workout, workoutExercises, allExercises } = data;
    let editingGroupName = workoutID === 'new';

    function handleAllUpdate(e: CustomEvent<{ exercises: Exercise[] }>) {
        allExercises = e.detail.exercises;
    }

    function handleWorkoutUpdate(e: CustomEvent<{ exercises: Exercise[] }>) {
        workoutExercises = e.detail.exercises;
    }

    function toggleEditGroupName() {
        editingGroupName = !editingGroupName;
    }

    function handleGroupNameBlur(e: FocusEvent) {
        const target = e.target as HTMLInputElement;
        workout.groupName = target.value;
    }

    async function handleUpdateWorkoutName() {
        // Only call the server when editing an existing workout
        if (workoutID !== 'new') {
            try {
                await saveWorkout(workout.id, { groupName: workout.groupName });
                editingGroupName = false;
            } catch (error) {
                console.error('Failed to update workout:', error);
                alert('Error: ' + error);
            }
        } else {
            // For a new workout, just close editing without calling server
            editingGroupName = false;
        }
    }

    async function handleSubmit() {
        const updated: Partial<Workout> = { exercises: workoutExercises.map((x) => x.id) };
        try {
            if (workoutID === 'new') {
                await createNewWorkout({ ...workout, ...updated });
            } else {
                await saveWorkout(workout.id, updated);
            }
            goto('/');
        } catch (error) {
            console.error('Failed to update workout:', error);
            alert('Error: ' + error);
        }
    }
</script>

{#if workout}
    <Title title={workoutID === 'new' ? 'Create Workout' : 'Edit Workout'} />
    <div class="card mb-4 flex flex-row items-center justify-between bg-secondary p-2">
        {#if editingGroupName}
            <input
                type="text"
                class="input input-bordered input-primary flex-grow"
                bind:value={workout.groupName}
                on:blur={handleGroupNameBlur}
                autofocus
            />
        {:else}
            <h2 id="groupName" class="card-title ml-2 flex-grow text-2xl text-black">{workout.groupName}</h2>
        {/if}
        {#if editingGroupName}
            <!-- For new workout, show check icon instead of 'floppy' but same button functionality -->
            <button
                on:click={handleUpdateWorkoutName}
                aria-label={workoutID === 'new' ? 'Confirm workout name' : 'Update workout name'}
                class="btn btn-ghost btn-secondary btn-sm"
            >
                <Icon icon={workoutID === 'new' ? 'bi:check' : 'bi:floppy'} class="h-6 w-6 text-black" />
            </button>
        {:else}
            <button
                on:click={toggleEditGroupName}
                aria-label="Edit workout name"
                class="btn btn-ghost btn-secondary btn-sm"
            >
                <Icon icon="bi:pencil" class="h-6 w-6 text-black" />
            </button>
        {/if}
    </div>

    <div class="grid grid-cols-2 gap-1">
        <!-- All Exercises -->
        <div id="all-exercises" class="flex h-full flex-col rounded border p-1 shadow">
            <h2 class="mb-2 text-center text-xl font-semibold uppercase">Available</h2>
            <DnDList exercises={allExercises} type="exercise" on:update={handleAllUpdate} />
        </div>

        <!-- Workout Exercises -->
        <div id="workout-exercises" class="flex h-full flex-col rounded border p-1 shadow">
            <h2 class="mb-2 text-center text-xl font-semibold uppercase">Selected</h2>
            <DnDList exercises={workoutExercises} type="exercise" on:update={handleWorkoutUpdate} />
        </div>
    </div>

    <button
        class="btn btn-circle btn-primary btn-lg fixed bottom-4 right-4 hover:btn-neutral hover:text-primary"
        on:click={handleSubmit}
    >
        <Icon icon="bi:check2" class="h-6 w-6" />
    </button>
{/if}
