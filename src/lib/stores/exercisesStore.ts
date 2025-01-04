import { writable } from 'svelte/store';
import { getExercises, updateExercise, type Exercise } from '$lib/api/exercises';

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

export async function toggleHidden(exercise: Exercise) {
	const updatedExercise = { ...exercise, hidden: !exercise.hidden };
	try {
		await updateExercise(exercise.id, updatedExercise);
		exercisesStore.update((exercises) =>
			exercises.map((ex) => (ex.id === exercise.id ? updatedExercise : ex))
		);
	} catch (error) {
		console.error('Error toggling hidden status:', error);
	}
}

export async function saveExercise(exercise: Exercise) {
	try {
		await updateExercise(exercise.id, exercise);
		exercisesStore.update((exercises) =>
			exercises.map((ex) => (ex.id === exercise.id ? exercise : ex))
		);
	} catch (error) {
		console.error('Error saving exercise:', error);
	}
}
