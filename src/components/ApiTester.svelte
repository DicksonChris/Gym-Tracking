<script>
    import { createExercise, getExercises, updateExercise, deleteExercise } from '$lib/pocketbase';
    import { onMount } from 'svelte';

    let exercises = [];
    let newExercise = { name: '', muscleGroup: '', tracking: '' };
    let updateData = { id: null, name: '', muscleGroup: '', tracking: '' };
    let deleteId = '';
    let message = '';

    onMount(async () => {
        exercises = await getExercises();
    });

    async function handleCreate() {
        try {
            const exercise = await createExercise(newExercise);
            exercises = [...exercises, exercise];
            message = 'Exercise created successfully.';
            newExercise = { name: '', muscleGroup: '', tracking: '' };
        } catch (error) {
            message = 'Error creating exercise.';
            console.error(error);
        }
    }

    async function handleUpdate() {
        try {
            if (!updateData.id) {
                message = 'Please provide an ID to update.';
                return;
            }
            const updated = await updateExercise(updateData.id, updateData);
            exercises = exercises.map(ex => ex.id === updated.id ? updated : ex);
            message = 'Exercise updated successfully.';
            updateData = { id: null, name: '', muscleGroup: '', tracking: '' };
        } catch (error) {
            message = 'Error updating exercise.';
            console.error(error);
        }
    }

    async function handleDelete() {
        try {
            await deleteExercise(Number(deleteId));
            exercises = exercises.filter(ex => ex.id !== Number(deleteId));
            message = 'Exercise deleted successfully.';
            deleteId = '';
        } catch (error) {
            message = 'Error deleting exercise.';
            console.error(error);
        }
    }

    async function refreshExercises() {
        exercises = await getExercises();
        message = 'Exercises refreshed.';
    }

    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.exercises || !Array.isArray(data.exercises)) {
                    message = 'No exercises found in the uploaded file.';
                    return;
                }

                for (const exercise of data.exercises) {
                    try {
                        await createExercise({
                            name: exercise.name,
                            muscleGroup: exercise.muscleGroup,
                            tracking: exercise.tracking
                        });
                        console.log(`Added exercise: ${exercise.name}`);
                    } catch (error) {
                        console.error(`Failed to add exercise: ${exercise.name}`, error);
                    }
                }

                await refreshExercises();
                message = 'Exercises added from JSON successfully.';
            } catch (error) {
                message = 'Error processing the uploaded file.';
                console.error(error);
            }
        };
        reader.readAsText(file);
    }
</script>

<div class="p-4 border rounded mb-8">
    <h2 class="text-2xl font-semibold mb-4">API Tester</h2>

    {#if message}
        <div class="alert alert-info mb-4">{message}</div>
    {/if}

    <!-- Create Exercise -->
    <div class="mb-6">
        <h3 class="text-xl font-medium mb-2">Create Exercise</h3>
        <input type="text" placeholder="Name" bind:value={newExercise.name} class="input input-bordered mb-2 w-full" />
        <input type="text" placeholder="Muscle Group" bind:value={newExercise.muscleGroup} class="input input-bordered mb-2 w-full" />
        <input type="text" placeholder="Tracking" bind:value={newExercise.tracking} class="input input-bordered mb-2 w-full" />
        <button on:click={handleCreate} class="btn btn-primary">Create</button>
    </div>

    <!-- Update Exercise -->
    <div class="mb-6">
        <h3 class="text-xl font-medium mb-2">Update Exercise</h3>
        <input type="number" placeholder="ID" bind:value={updateData.id} class="input input-bordered mb-2 w-full" />
        <input type="text" placeholder="Name" bind:value={updateData.name} class="input input-bordered mb-2 w-full" />
        <input type="text" placeholder="Muscle Group" bind:value={updateData.muscleGroup} class="input input-bordered mb-2 w-full" />
        <input type="text" placeholder="Tracking" bind:value={updateData.tracking} class="input input-bordered mb-2 w-full" />
        <button on:click={handleUpdate} class="btn btn-secondary">Update</button>
    </div>

    <!-- Delete Exercise -->
    <div class="mb-6">
        <h3 class="text-xl font-medium mb-2">Delete Exercise</h3>
        <input type="number" placeholder="ID" bind:value={deleteId} class="input input-bordered mb-2 w-full" />
        <button on:click={handleDelete} class="btn btn-error">Delete</button>
    </div>

    <!-- Refresh Exercises -->
    <div class="mb-6">
        <button on:click={refreshExercises} class="btn btn-outline">Refresh Exercises</button>
    </div>

    <!-- Add Exercises from JSON -->
    <div class="mb-6">
        <input type="file" accept=".json" on:change={handleFileUpload} class="input input-bordered mb-2 w-full" />
    </div>

    <!-- Display Exercises -->
    <div>
        <h3 class="text-xl font-medium mb-2">Current Exercises</h3>
        <ul class="list-disc list-inside">
            {#each exercises as exercise}
                <li>ID: {exercise.id}, Name: {exercise.name}, Muscle Group: {exercise.muscleGroup}, Tracking: {exercise.tracking}</li>
            {/each}
        </ul>
    </div>
</div>
