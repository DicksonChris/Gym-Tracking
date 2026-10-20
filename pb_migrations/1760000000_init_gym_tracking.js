/// <reference path="../pb_data/types.d.ts" />
/**
 * Initial Gym-Tracking schema.
 *
 * Creates the `exercises`, `workouts` and `history` collections and extends
 * the built-in `users` auth collection with `theme` and `selectedWorkouts`.
 * All collections are owner-scoped: records are only visible/editable by the
 * user that created them.
 *
 * Applied automatically by `pocketbase serve` when this file is in pb_migrations.
 */
migrate(
	(app) => {
		const users = app.findCollectionByNameOrId('users');

		// --- extend users with app preference fields ---
		users.fields.add(new TextField({ name: 'theme' }));
		users.fields.add(new JSONField({ name: 'selectedWorkouts' }));
		app.save(users);

		const ownerRule = '@request.auth.id != "" && user = @request.auth.id';

		// --- exercises ---
		const exercises = new Collection({
			type: 'base',
			name: 'exercises',
			listRule: ownerRule,
			viewRule: ownerRule,
			createRule: ownerRule,
			updateRule: ownerRule,
			deleteRule: ownerRule,
			fields: [
				{
					name: 'user',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: users.id
				},
				{ name: 'name', type: 'text', required: true },
				{ name: 'muscleGroup', type: 'text' },
				{
					name: 'measurement',
					type: 'select',
					maxSelect: 4,
					values: ['weight', 'reps', 'distance', 'time']
				},
				{ name: 'hidden', type: 'bool' },
				{ name: 'defaultReps', type: 'number' },
				{ name: 'defaultStep', type: 'number' },
				{ name: 'url', type: 'url' }
			]
		});
		app.save(exercises);

		// --- workouts ---
		const workouts = new Collection({
			type: 'base',
			name: 'workouts',
			listRule: ownerRule,
			viewRule: ownerRule,
			createRule: ownerRule,
			updateRule: ownerRule,
			deleteRule: ownerRule,
			fields: [
				{
					name: 'user',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: users.id
				},
				{ name: 'groupName', type: 'text', required: true },
				{
					name: 'exercises',
					type: 'relation',
					maxSelect: 999,
					cascadeDelete: false,
					collectionId: exercises.id
				}
			]
		});
		app.save(workouts);

		// --- history ---
		// startTime is stored as text: the app writes/reads ISO 8601 strings
		// and parses them with `new Date(...)` on the client.
		const history = new Collection({
			type: 'base',
			name: 'history',
			listRule: ownerRule,
			viewRule: ownerRule,
			createRule: ownerRule,
			updateRule: ownerRule,
			deleteRule: ownerRule,
			fields: [
				{
					name: 'user',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: users.id
				},
				{
					name: 'exercise',
					type: 'relation',
					required: true,
					maxSelect: 1,
					cascadeDelete: true,
					collectionId: exercises.id
				},
				{ name: 'startTime', type: 'text' },
				{ name: 'reps', type: 'number' },
				{ name: 'weight', type: 'number' },
				{ name: 'distance', type: 'text' },
				{ name: 'time', type: 'text' }
			]
		});
		app.save(history);
	},
	(app) => {
		for (const name of ['history', 'workouts', 'exercises']) {
			try {
				app.delete(app.findCollectionByNameOrId(name));
			} catch {
				/* already gone */
			}
		}

		try {
			const users = app.findCollectionByNameOrId('users');
			users.fields.removeByName('theme');
			users.fields.removeByName('selectedWorkouts');
			app.save(users);
		} catch {
			/* ignore */
		}
	}
);
