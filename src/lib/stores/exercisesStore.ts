import { writable, get } from 'svelte/store';
import { getExercise, getExercises, createExercise, updateExercise, type Exercise } from '$lib/api/exercises';

export const exercisesStore = writable<Exercise[] | null>(null);
let isLoading = false; // Add a loading flag

export async function loadExercises() {
    if (isLoading) return; // Prevent duplicate calls
    isLoading = true;
    try {
        const exercises = await getExercises();
        // Default muscleGroup to '' if undefined
        exercisesStore.set(exercises.map(ex => ({
            ...ex,
            muscleGroup: ex.muscleGroup || ''
        })));
    } catch (error) {
        console.error('Error loading exercises:', error);
        exercisesStore.set([]);
    } finally {
        isLoading = false;
    }
}

export async function loadAllExercises(): Promise<Exercise[]> {
	const exercises = await getExercises();
	// Default muscleGroup to '' if undefined
	return exercises.map(ex => ({
		...ex,
		muscleGroup: ex.muscleGroup || ''
	}));
}

export async function loadExercise(id: string): Promise<Exercise | null> {
	try {
		const exercise = await getExercise(id);
		// Default muscleGroup to '' if undefined
		return {
			...exercise,
			muscleGroup: exercise.muscleGroup || ''
		};
	} catch (error) {
		console.error('Error loading exercise:', error);
		return null;
	}
}

export async function toggleHidden(exercise: Exercise) {
	const updatedExercise = { ...exercise, hidden: !exercise.hidden };
	try {
		await updateExercise(exercise.id, updatedExercise);
		exercisesStore.update((exercises) =>
			exercises!.map((ex) => (ex.id === exercise.id ? updatedExercise : ex))
		);
	} catch (error) {
		console.error('Error toggling hidden status:', error);
	}
}

export async function createNewExercise(data: Partial<Exercise>) {
	const record = await createExercise(data);
	const exercise: Exercise = {
		id: record.id,
		name: record.name,
		muscleGroup: record.muscleGroup || '', // Ensure muscleGroup is a string
		hidden: record.hidden || false,
		measurement: record.measurement || [],
		defaultReps: record.defaultReps || null,
		defaultStep: record.defaultStep || null,
		url: record.url || ''
	};
	exercisesStore.update((exercises) => (exercises ? [...exercises, exercise] : [exercise]));
}

export async function saveExercise(partialExercise: Partial<Exercise>) {
    try {
        if (!partialExercise.id) {
            throw new Error('Exercise ID is required for saving.');
        }

        const currentExercises = get(exercisesStore);
        if (!currentExercises) {
            throw new Error('No exercises available in the store.');
        }

        const existingExercise = currentExercises.find((ex) => ex.id === partialExercise.id);
        if (!existingExercise) {
            throw new Error(`Exercise with ID ${partialExercise.id} not found.`);
        }

        const updatedExercise: Exercise = { ...existingExercise, ...partialExercise };

        updatedExercise.muscleGroup = updatedExercise.muscleGroup || '';

        await updateExercise(updatedExercise.id, updatedExercise);

        exercisesStore.update((exercises) =>
            exercises!.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex))
        );
    } catch (error) {
        console.error('Error saving exercise:', error);
        throw error;
    }
}

export async function loadMuscleGroups(): Promise<string[]> {
	await loadExercises();

	const exercises = get(exercisesStore);
	const muscleGroupSet = new Set<string>();

	exercises?.forEach((exercise) => {
		if (exercise.muscleGroup) {
			exercise.muscleGroup
				.split(',')
				.map((g) => g.trim())
				.forEach((g) => muscleGroupSet.add(g));
		}
	});

	return Array.from(muscleGroupSet);
}
