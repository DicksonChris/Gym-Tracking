import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL;
const pb = new PocketBase(pocketbaseUrl);

// Authenticate as superuser
async function authenticateSuperuser() {
    const email = import.meta.env.VITE_SUPERUSER_EMAIL;
    const password = import.meta.env.VITE_SUPERUSER_PASSWORD;

    try {
        await pb.admins.authWithPassword(email, password);
        console.log('Authenticated as superuser');
    } catch (error) {
        console.error('Failed to authenticate as superuser:', error);
    }
}

// Call the authentication function
authenticateSuperuser();

// Define interfaces
export interface Workout {
    id: string;
    groupName: string;
    exercises: string[];
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string;
    tracking: string;
}

export interface MeasurementSetsReps {
    reps: number;
    weight: number;
}

export interface MeasurementTime {
    duration: string;
    distance?: string;
}

export type Measurement = MeasurementSetsReps | MeasurementTime;

export interface HistoryEntry {
    exerciseId: string;
    timestamp: string;
    measurement: Measurement;
}

// Update CRUD functions with types
export async function getWorkouts(): Promise<Workout[]> {
    return await pb.collection('workouts').getFullList();
}

export async function getExercises(): Promise<Exercise[]> {
    return await pb.collection('exercises').getFullList();
}

export async function getHistory(): Promise<HistoryEntry[]> {
    return await pb.collection('history').getFullList();
}

// Create a new exercise
export async function createExercise(data: Omit<Exercise, 'id'>): Promise<Exercise> {
    return await pb.collection('exercises').create(data);
}

// Get a single exercise by ID
export async function getExerciseById(id: string): Promise<Exercise> {
    return await pb.collection('exercises').getOne(id);
}

// Update an existing exercise
export async function updateExercise(id: string, data: Partial<Exercise>): Promise<Exercise> {
    return await pb.collection('exercises').update(id, data);
}

// Delete an exercise
export async function deleteExercise(id: string): Promise<void> {
    await pb.collection('exercises').delete(id);
}

// Add exercises from db.json
export async function addExercisesFromJson() {
  const filePath = path.join(__dirname, 'db.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!data.exercises || !Array.isArray(data.exercises)) {
      console.error('No exercises found in db.json');
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
}

export default pb;