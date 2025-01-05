import { writable, get } from 'svelte/store';
import { getExercise, getExercises, createExercise, updateExercise, type Exercise } from '$lib/api/exercises';

export const exercisesStore = writable<Exercise[] | null>(null);

export async function loadExercises() {
	try {
		const exercises = await getExercises();
		exercisesStore.set(exercises);
	} catch (error) {
		console.error('Error loading exercises:', error);
		exercisesStore.set([]);
	}
}

export async function loadAllExercises(): Promise<Exercise[]> {
	return await getExercises();
}

export async function loadExercise(id: string): Promise<Exercise | null> {
  try {
    return await getExercise(id);
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
		muscleGroup: record.muscleGroup || '',
		hidden: record.hidden || false
	};
	exercisesStore.update((exercises) => (exercises ? [...exercises, exercise] : [exercise]));
}

export async function saveExercise(exercise: Exercise) {
	try {
		await updateExercise(exercise.id, exercise);
		exercisesStore.update((exercises) =>
			exercises!.map((ex) => (ex.id === exercise.id ? exercise : ex))
		);
	} catch (error) {
		console.error('Error saving exercise:', error);
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
