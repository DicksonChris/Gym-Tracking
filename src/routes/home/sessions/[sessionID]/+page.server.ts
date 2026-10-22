import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSession, getSessionHistories } from '$lib/api/sessions';
import { getExercises } from '$lib/api/exercises';
import { getHistories, type History } from '$lib/api/history';

export interface SummaryExercise {
	id: string;
	name: string;
	sets: History[];
	volume: number;
	bestWeight: number;
	/** Beat a previous best weight (only counted when there was one to beat). */
	isPR: boolean;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) throw redirect(303, '/login');

	const session = await getSession(locals.pb, user, params.sessionID).catch(() => null);
	if (!session) throw error(404, 'Workout not found');
	if (!session.endedAt) throw redirect(303, '/home/today');

	const [sets, exercises, allHistory] = await Promise.all([
		getSessionHistories(locals.pb, user, session.id),
		getExercises(locals.pb, user, true),
		getHistories(locals.pb, user)
	]);
	const names = new Map(exercises.map((e) => [e.id, e.name]));

	// keep the session's order, then any extra exercises that have sets
	const order = [...session.exercises];
	for (const s of sets) if (!order.includes(s.exercise)) order.push(s.exercise);

	const summary: SummaryExercise[] = order
		.map((id) => {
			const exSets = sets.filter((s) => s.exercise === id);
			const priorBest = Math.max(
				0,
				...allHistory
					.filter((h) => h.exercise === id && h.session !== session.id && h.startTime < session.startedAt)
					.map((h) => h.weight ?? 0)
			);
			const bestWeight = Math.max(0, ...exSets.map((s) => s.weight ?? 0));
			return {
				id,
				name: names.get(id) ?? 'Deleted exercise',
				sets: exSets,
				volume: exSets.reduce((v, s) => v + (s.weight ?? 0) * (s.reps ?? 0), 0),
				bestWeight,
				isPR: priorBest > 0 && bestWeight > priorBest
			};
		})
		.filter((e) => e.sets.length > 0);

	return {
		session,
		summary,
		totals: {
			durationMs: new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime(),
			sets: sets.length,
			volume: summary.reduce((v, e) => v + e.volume, 0),
			prs: summary.filter((e) => e.isPR).length
		}
	};
};
