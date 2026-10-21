import type { RequestHandler } from './$types';
import { getExercises } from '$lib/api/exercises';
import { getHistories } from '$lib/api/history';

function csvField(v: unknown): string {
	const s = v == null ? '' : String(v);
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Download the user's full history as CSV. */
export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.pb.authStore.record;
	if (!user) {
		return new Response('Not authenticated', { status: 401 });
	}

	const [exercises, histories] = await Promise.all([
		getExercises(locals.pb, user, true),
		getHistories(locals.pb, user)
	]);
	const exById = new Map(exercises.map((e) => [e.id, e]));

	const header = 'date,exercise,muscleGroup,reps,weight,distance,time,note';
	const lines = histories
		.slice()
		.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
		.map((h) => {
			const ex = exById.get(h.exercise);
			return [
				h.startTime,
				ex?.name ?? h.exercise,
				ex?.muscleGroup ?? '',
				h.reps ?? '',
				h.weight ?? '',
				h.distance ?? '',
				h.time ?? '',
				h.note ?? ''
			]
				.map(csvField)
				.join(',');
		});

	return new Response([header, ...lines].join('\n'), {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="gains-galaxy-history-${new Date().toISOString().slice(0, 10)}.csv"`
		}
	});
};
