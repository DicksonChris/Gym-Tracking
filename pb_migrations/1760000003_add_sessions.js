/// <reference path="../pb_data/types.d.ts" />
/**
 * Workout sessions. A session is either started from a workout (routine) or
 * empty (freeform); exercises are appended as you go. Sets logged during a
 * session reference it via history.session. An empty endedAt = in progress.
 */
migrate(
	(app) => {
		const users = app.findCollectionByNameOrId('users');
		const exercises = app.findCollectionByNameOrId('exercises');
		const workouts = app.findCollectionByNameOrId('workouts');
		const ownerRule = '@request.auth.id != "" && user = @request.auth.id';

		const sessions = new Collection({
			type: 'base',
			name: 'sessions',
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
				{ name: 'name', type: 'text' },
				{
					name: 'workout',
					type: 'relation',
					maxSelect: 1,
					cascadeDelete: false,
					collectionId: workouts.id
				},
				{
					name: 'exercises',
					type: 'relation',
					maxSelect: 999,
					cascadeDelete: false,
					collectionId: exercises.id
				},
				// ISO 8601 text, consistent with history.startTime
				{ name: 'startedAt', type: 'text', required: true },
				{ name: 'endedAt', type: 'text' },
				{ name: 'note', type: 'text' }
			],
			indexes: ['CREATE INDEX idx_sessions_user_ended ON sessions (user, endedAt)']
		});
		app.save(sessions);

		const history = app.findCollectionByNameOrId('history');
		history.fields.add(
			new RelationField({
				name: 'session',
				maxSelect: 1,
				cascadeDelete: false,
				collectionId: sessions.id
			})
		);
		app.save(history);
	},
	(app) => {
		const history = app.findCollectionByNameOrId('history');
		history.fields.removeByName('session');
		app.save(history);
		app.delete(app.findCollectionByNameOrId('sessions'));
	}
);
