/// <reference path="../pb_data/types.d.ts" />
/**
 * Adds a per-exercise rest duration (seconds; -1 = no timer, 0 = app default)
 * and backfills sensible values for exercises from the default program.
 */
migrate(
	(app) => {
		const exercises = app.findCollectionByNameOrId('exercises');
		exercises.fields.add(new NumberField({ name: 'restSeconds', onlyInt: true }));
		app.save(exercises);

		// keep in sync with src/lib/api/defaultProgram.ts
		const defaults = {
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

		const records = app.findAllRecords('exercises');
		for (const record of records) {
			const seconds = defaults[record.getString('name')];
			if (seconds !== undefined && record.getInt('restSeconds') === 0) {
				record.set('restSeconds', seconds);
				app.save(record);
			}
		}
	},
	(app) => {
		const exercises = app.findCollectionByNameOrId('exercises');
		exercises.fields.removeByName('restSeconds');
		app.save(exercises);
	}
);
