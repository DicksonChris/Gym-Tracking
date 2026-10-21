import type PocketBase from 'pocketbase';

/**
 * Default starter program, recovered from the original db.json
 * (git history, commit 91275a4). Numeric ids are only used to wire
 * workouts to exercises during seeding.
 */

interface SeedExercise {
	id: number;
	name: string;
	muscleGroup: string;
	measurement: string[];
}

interface SeedWorkout {
	groupName: string;
	exercises: number[];
}

const WEIGHT_REPS = ['weight', 'reps'];
const TIME = ['time'];
const TIME_DISTANCE = ['time', 'distance'];

export const defaultExercises: SeedExercise[] = [
	{ id: 1, name: 'Barbell Squat', muscleGroup: 'Quads', measurement: WEIGHT_REPS },
	{ id: 2, name: 'Flat Dumbbell Bench Press', muscleGroup: 'Chest', measurement: WEIGHT_REPS },
	{ id: 3, name: 'Wide Grip Pulldowns', muscleGroup: 'Lats', measurement: WEIGHT_REPS },
	{ id: 4, name: 'Leg Curls', muscleGroup: 'Hamstrings', measurement: WEIGHT_REPS },
	{
		id: 5,
		name: 'Dumbbell Standing Overhead Press',
		muscleGroup: 'Shoulders',
		measurement: WEIGHT_REPS
	},
	{ id: 6, name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps', measurement: WEIGHT_REPS },
	{ id: 7, name: 'Cable Pushdown with Rope', muscleGroup: 'Triceps', measurement: WEIGHT_REPS },
	{ id: 8, name: 'Straight Leg Calf Raises', muscleGroup: 'Gastroc', measurement: WEIGHT_REPS },
	{ id: 9, name: 'Face Pulls and Raise', muscleGroup: 'Mid Traps', measurement: WEIGHT_REPS },
	{ id: 10, name: 'Deadlifts', muscleGroup: 'Gluts', measurement: WEIGHT_REPS },
	{ id: 11, name: 'Incline Dumbbell Bench', muscleGroup: 'Chest', measurement: WEIGHT_REPS },
	{ id: 12, name: 'Cable Row', muscleGroup: 'Back, Rear Delts', measurement: WEIGHT_REPS },
	{ id: 13, name: 'Leg Press', muscleGroup: 'Quads', measurement: WEIGHT_REPS },
	{ id: 14, name: 'Dumbbell Lateral Raise', muscleGroup: 'Mid Delt', measurement: WEIGHT_REPS },
	{ id: 15, name: 'Dumbbell Hammer Curl', muscleGroup: 'Biceps', measurement: WEIGHT_REPS },
	{
		id: 16,
		name: 'Overhead Triceps Extension',
		muscleGroup: 'Triceps',
		measurement: WEIGHT_REPS
	},
	{ id: 17, name: 'Seated Calf Raises', muscleGroup: 'Soleus', measurement: WEIGHT_REPS },
	{ id: 18, name: 'Dumbbell Skullcrusher', muscleGroup: 'Triceps', measurement: WEIGHT_REPS },
	{
		id: 19,
		name: 'Bent Over Dumbbell Row',
		muscleGroup: 'Back, Rear Delts',
		measurement: WEIGHT_REPS
	},
	{ id: 20, name: 'Fly Machine', muscleGroup: 'Chest', measurement: WEIGHT_REPS },
	{ id: 21, name: 'Leg Extension', muscleGroup: 'Quads', measurement: WEIGHT_REPS },
	{ id: 22, name: 'Back Extensions', muscleGroup: 'Lower Back', measurement: WEIGHT_REPS },
	{ id: 23, name: 'Dumbbell Preacher Curl', muscleGroup: 'Biceps', measurement: WEIGHT_REPS },
	{ id: 24, name: 'Heels To The Heavens', muscleGroup: 'Abs', measurement: TIME },
	{ id: 25, name: 'X-Man Crunch', muscleGroup: 'Abs', measurement: TIME },
	{ id: 26, name: 'Running', muscleGroup: 'Heart', measurement: TIME_DISTANCE },
	{ id: 27, name: 'Biking', muscleGroup: 'Heart', measurement: TIME_DISTANCE }
];

/**
 * Rest between sets (seconds; -1 = no timer). Heavy compounds get longer rest.
 * Keep in sync with pb_migrations/1760000002_add_exercise_rest.js.
 */
export const defaultRest: Record<string, number> = {
	'Barbell Squat': 180,
	'Flat Dumbbell Bench Press': 120,
	'Wide Grip Pulldowns': 90,
	'Leg Curls': 90,
	'Dumbbell Standing Overhead Press': 120,
	'Incline Dumbbell Curl': 60,
	'Cable Pushdown with Rope': 60,
	'Straight Leg Calf Raises': 60,
	'Face Pulls and Raise': 60,
	Deadlifts: 300,
	'Incline Dumbbell Bench': 120,
	'Cable Row': 90,
	'Leg Press': 120,
	'Dumbbell Lateral Raise': 60,
	'Dumbbell Hammer Curl': 60,
	'Overhead Triceps Extension': 60,
	'Seated Calf Raises': 60,
	'Dumbbell Skullcrusher': 60,
	'Bent Over Dumbbell Row': 90,
	'Fly Machine': 60,
	'Leg Extension': 60,
	'Back Extensions': 90,
	'Dumbbell Preacher Curl': 60,
	'Heels To The Heavens': 45,
	'X-Man Crunch': 45,
	Running: -1,
	Biking: -1
};

export const defaultWorkouts: SeedWorkout[] = [
	{ groupName: 'Fullbody 1 Heavy', exercises: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
	{ groupName: 'Fullbody 2 Medium', exercises: [10, 11, 12, 13, 14, 15, 16, 17, 9] },
	{ groupName: 'Fullbody 3 Light', exercises: [18, 19, 20, 21, 22, 23, 9] },
	{ groupName: 'Ab Routine', exercises: [24, 25] },
	{ groupName: 'Cardio', exercises: [26, 27] }
];

/**
 * Create the default exercises and workouts for a user.
 * `pb` must be authenticated as that user (or a superuser).
 */
export async function seedDefaultProgram(pb: PocketBase, userId: string) {
	const idMap = new Map<number, string>();

	for (const ex of defaultExercises) {
		const record = await pb.collection('exercises').create({
			user: userId,
			name: ex.name,
			muscleGroup: ex.muscleGroup,
			measurement: ex.measurement,
			restSeconds: defaultRest[ex.name] ?? 0
		});
		idMap.set(ex.id, record.id);
	}

	for (const workout of defaultWorkouts) {
		await pb.collection('workouts').create({
			user: userId,
			groupName: workout.groupName,
			exercises: workout.exercises.map((id) => idMap.get(id))
		});
	}
}
