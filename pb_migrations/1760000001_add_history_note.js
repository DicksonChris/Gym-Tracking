/// <reference path="../pb_data/types.d.ts" />
/** Adds an optional per-set note to history records. */
migrate(
	(app) => {
		const history = app.findCollectionByNameOrId('history');
		history.fields.add(new TextField({ name: 'note' }));
		app.save(history);
	},
	(app) => {
		const history = app.findCollectionByNameOrId('history');
		history.fields.removeByName('note');
		app.save(history);
	}
);
