import type PocketBase from 'pocketbase';
import type { AuthRecord } from 'pocketbase';
import type { History } from '$lib/api/history';
import { getExercise } from '$lib/api/exercises';
import { getWorkout } from '$lib/api/workouts';

export interface Session {
	id: string;
	user?: string;
	name: string;
	/** Source workout for routine sessions; empty for freeform. */
	workout?: string;
	/** Ordered exercise IDs planned/added for this session. */
	exercises: string[];
	startedAt: string;
	/** Empty while the session is in progress. */
	endedAt?: string;
	note?: string;
}

export interface SessionSummary extends Session {
	setCount: number;
}

export const FREEFORM_NAME = 'Freeform workout';

function requireUser(user: AuthRecord | null): asserts user is NonNullable<AuthRecord> {
	if (!user) throw new Error('Not authenticated');
}

export async function getActiveSession(
	pb: PocketBase,
	user: AuthRecord | null
): Promise<Session | null> {
	if (!user) return null;
	const res = await pb.collection('sessions').getList<Session>(1, 1, {
		filter: pb.filter('user = {:user} && endedAt = ""', { user: user.id }),
		sort: '-startedAt',
		requestKey: null
	});
	return res.items[0] ?? null;
}

export async function getSession(
	pb: PocketBase,
	user: AuthRecord | null,
	sessionId: string
): Promise<Session> {
	requireUser(user);
	const session = await pb.collection('sessions').getOne<Session>(sessionId);
	if (session.user !== user.id) throw new Error('Unauthorized or record not found');
	return session;
}

/** Start a session (from a workout, or freeform). Returns the existing one if already active. */
export async function startSession(
	pb: PocketBase,
	user: AuthRecord | null,
	workoutId?: string
): Promise<Session> {
	requireUser(user);
	const active = await getActiveSession(pb, user);
	if (active) return active;

	let name = FREEFORM_NAME;
	let exercises: string[] = [];
	if (workoutId) {
		const workout = await getWorkout(pb, user, workoutId);
		name = workout.groupName;
		exercises = workout.exercises ?? [];
	}

	return await pb.collection('sessions').create<Session>({
		user: user.id,
		name,
		workout: workoutId || '',
		exercises,
		startedAt: new Date().toISOString(),
		endedAt: ''
	});
}

/** Append an exercise to a session's list (no-op if already present). */
export async function addExerciseToSession(
	pb: PocketBase,
	user: AuthRecord | null,
	sessionId: string,
	exerciseId: string
): Promise<Session> {
	const session = await getSession(pb, user, sessionId);
	if (session.exercises?.includes(exerciseId)) return session;
	await getExercise(pb, user, exerciseId, true); // ownership check
	return await pb.collection('sessions').update<Session>(sessionId, { 'exercises+': exerciseId });
}

export async function finishSession(
	pb: PocketBase,
	user: AuthRecord | null,
	sessionId: string,
	note?: string
): Promise<Session> {
	const session = await getSession(pb, user, sessionId);
	if (session.endedAt) return session;
	return await pb.collection('sessions').update<Session>(sessionId, {
		endedAt: new Date().toISOString(),
		...(note ? { note: note.slice(0, 1000) } : {})
	});
}

/** Delete a session and every set logged in it. */
export async function discardSession(
	pb: PocketBase,
	user: AuthRecord | null,
	sessionId: string
): Promise<void> {
	await getSession(pb, user, sessionId);
	const sets = await getSessionHistories(pb, user, sessionId);
	for (const s of sets) {
		if (s.id) await pb.collection('history').delete(s.id);
	}
	await pb.collection('sessions').delete(sessionId);
}

export async function getSessionHistories(
	pb: PocketBase,
	user: AuthRecord | null,
	sessionId: string
): Promise<History[]> {
	requireUser(user);
	return await pb.collection('history').getFullList<History>({
		filter: pb.filter('user = {:user} && session = {:session}', {
			user: user.id,
			session: sessionId
		}),
		sort: 'startTime',
		requestKey: null
	});
}

/** Most recent finished sessions with their set counts. */
export async function getRecentSessions(
	pb: PocketBase,
	user: AuthRecord | null,
	limit = 10
): Promise<SessionSummary[]> {
	if (!user) return [];
	const res = await pb.collection('sessions').getList<Session>(1, limit, {
		filter: pb.filter('user = {:user} && endedAt != ""', { user: user.id }),
		sort: '-startedAt',
		requestKey: null
	});
	if (res.items.length === 0) return [];

	const params: Record<string, string> = { user: user.id };
	const clauses = res.items.map((s, i) => {
		params[`s${i}`] = s.id;
		return `session = {:s${i}}`;
	});
	const sets = await pb.collection('history').getFullList<History & { session: string }>({
		filter: pb.filter(`user = {:user} && (${clauses.join(' || ')})`, params),
		fields: 'session',
		requestKey: null
	});
	const counts = new Map<string, number>();
	for (const s of sets) counts.set(s.session, (counts.get(s.session) ?? 0) + 1);

	return res.items.map((s) => ({ ...s, setCount: counts.get(s.id) ?? 0 }));
}
