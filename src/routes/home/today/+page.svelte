<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import StartWorkout from '$lib/components/StartWorkout.svelte';
	import ElapsedClock from '$lib/components/ElapsedClock.svelte';
	import { clearRestTimer } from '$lib/stores/restTimer';
	import { fmtDurationLong } from '$lib/sessionClient';
	import type { Exercise } from '$lib/api/exercises';
	import type { History } from '$lib/api/history';
	import type { Workout } from '$lib/api/workouts';
	import type { Session, SessionSummary } from '$lib/api/sessions';

	export let data: {
		workouts: Workout[];
		exercises: Exercise[];
		selectedWorkouts: string[];
		histories: Record<string, History[]>;
		recentSessions: SessionSummary[];
		activeSession: Session | null;
	};

	$: session = data.activeSession;

	$: orderedWorkouts = data.selectedWorkouts
		.map((id) => data.workouts.find((w) => w.id === id))
		.filter((w): w is Workout => w !== undefined);

	$: exerciseMap = new Map(data.exercises.map((e) => [e.id, e]));

	// sets logged in the active session, grouped by exercise
	$: setsByExercise = (() => {
		const map = new Map<string, History[]>();
		if (!session) return map;
		for (const list of Object.values(data.histories)) {
			for (const h of list) {
				if (h.session === session.id) {
					const arr = map.get(h.exercise) ?? [];
					arr.push(h);
					map.set(h.exercise, arr);
				}
			}
		}
		for (const arr of map.values()) arr.sort((a, b) => a.startTime.localeCompare(b.startTime));
		return map;
	})();

	const sessionSets = (exerciseId: string, map: Map<string, History[]>) => map.get(exerciseId) ?? [];

	/** Sets from the most recent earlier day this exercise was trained. */
	function lastSession(exerciseId: string): History[] {
		const prior = (data.histories[exerciseId] ?? [])
			.filter((h) => !session || (h.session !== session.id && h.startTime < session.startedAt))
			.sort((a, b) => b.startTime.localeCompare(a.startTime));
		if (prior.length === 0) return [];
		const day = new Date(prior[0].startTime).toDateString();
		return prior.filter((h) => new Date(h.startTime).toDateString() === day).reverse();
	}

	function fmtSet(h: History): string {
		if (h.reps && h.weight) return `${h.reps}×${h.weight}`;
		if (h.reps) return `${h.reps} reps`;
		if (h.weight) return `${h.weight} lbs`;
		return [h.time && `${h.time}m`, h.distance].filter(Boolean).join(' ');
	}

	const summary = (sets: History[]) => sets.map(fmtSet).join(', ');

	$: sessionExercises = (session?.exercises ?? [])
		.map((id) => exerciseMap.get(id))
		.filter((e): e is Exercise => !!e);
	$: doneCount = sessionExercises.filter((e) => setsByExercise.has(e.id)).length;
	$: setCount = [...setsByExercise.values()].reduce((n, arr) => n + arr.length, 0);

	// --- add-exercise picker ---
	let showPicker = false;
	let query = '';
	let adding: string | null = null;

	$: if (session && session.exercises.length === 0) showPicker = true;

	$: pickable = data.exercises
		.filter((e) => !e.hidden && !session?.exercises.includes(e.id))
		.filter((e) => {
			const q = query.trim().toLowerCase();
			return !q || e.name.toLowerCase().includes(q) || e.muscleGroup?.toLowerCase().includes(q);
		})
		.sort((a, b) => a.name.localeCompare(b.name));

	async function addExercise(exerciseId: string) {
		if (!session || adding) return;
		adding = exerciseId;
		try {
			const res = await fetch(`/api/sessions/${session.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ action: 'addExercise', exercise: exerciseId })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			await goto(`/home/exercise/${exerciseId}`);
		} catch (err) {
			console.error('Failed to add exercise:', err);
			alert('Failed to add exercise.');
		} finally {
			adding = null;
		}
	}

	// --- finish / discard ---
	let busy = false;

	async function finish() {
		if (!session || busy) return;
		if (setCount === 0 && !confirm('No sets logged yet. Finish anyway?')) return;
		busy = true;
		try {
			const res = await fetch(`/api/sessions/${session.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ action: 'finish' })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			clearRestTimer();
			await goto(`/home/sessions/${session.id}`, { invalidateAll: true });
		} catch (err) {
			console.error('Failed to finish workout:', err);
			alert('Failed to finish workout.');
		} finally {
			busy = false;
		}
	}

	async function discard() {
		if (!session || busy) return;
		const msg =
			setCount > 0
				? `Discard this workout? The ${setCount} set${setCount === 1 ? '' : 's'} logged in it will be deleted.`
				: 'Discard this workout?';
		if (!confirm(msg)) return;
		busy = true;
		try {
			const res = await fetch(`/api/sessions/${session.id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			clearRestTimer();
			await invalidateAll();
		} catch (err) {
			console.error('Failed to discard workout:', err);
			alert('Failed to discard workout.');
		} finally {
			busy = false;
		}
	}

	function fmtDate(iso: string): string {
		return new Date(iso).toLocaleDateString('default', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#if session}
	<!-- active session -->
	<div class="mb-4 flex items-start justify-between gap-3 px-1">
		<div class="min-w-0">
			<h1 class="truncate text-2xl font-bold text-base-content">{session.name}</h1>
			<p class="text-sm opacity-70">
				<span class="text-success">●</span>
				<ElapsedClock startedAt={session.startedAt} />
				· {setCount} set{setCount === 1 ? '' : 's'}
				{#if sessionExercises.length > 0}· {doneCount}/{sessionExercises.length} exercises{/if}
			</p>
		</div>
		<div class="flex flex-shrink-0 gap-1">
			<button class="btn btn-ghost btn-sm text-error" disabled={busy} on:click={discard}>
				Discard
			</button>
			<button class="btn btn-primary btn-sm" disabled={busy} on:click={finish}>
				{#if busy}<span class="loading loading-spinner loading-xs"></span>{/if}
				Finish
			</button>
		</div>
	</div>

	{#if sessionExercises.length > 0}
		<section class="card mb-4 bg-base-100">
			<ul>
				{#each sessionExercises as exercise (exercise.id)}
					{@const sets = sessionSets(exercise.id, setsByExercise)}
					{@const last = lastSession(exercise.id)}
					<li>
						<a
							href="/home/exercise/{exercise.id}"
							class="flex w-full items-center gap-3 border-b border-base-200 px-3 py-3 text-left transition-colors hover:bg-base-200"
						>
							{#if sets.length > 0}
								<Icon icon="mdi:check-circle" class="h-6 w-6 flex-shrink-0 text-success" />
							{:else}
								<Icon
									icon="mdi:checkbox-blank-circle-outline"
									class="h-6 w-6 flex-shrink-0 opacity-30"
								/>
							{/if}
							<span class="min-w-0 flex-1">
								<span class="block truncate font-medium text-base-content">{exercise.name}</span>
								<span class="block truncate text-xs opacity-60">
									{#if sets.length > 0}
										{summary(sets)}
									{:else if last.length > 0}
										Last: {summary(last)}
									{:else}
										No history yet
									{/if}
								</span>
							</span>
							{#if sets.length > 0}
								<span class="badge badge-primary badge-sm">{sets.length}</span>
							{/if}
							<Icon icon="mdi:chevron-right" class="h-5 w-5 flex-shrink-0 opacity-40" />
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- add exercise -->
	{#if showPicker}
		<section class="card bg-base-100 p-3">
			<div class="mb-2 flex items-center justify-between">
				<h2 class="font-semibold text-base-content">
					{sessionExercises.length === 0 ? 'Pick your first exercise' : 'Add exercise'}
				</h2>
				{#if sessionExercises.length > 0}
					<button
						class="btn btn-ghost btn-xs"
						aria-label="Close"
						on:click={() => ((showPicker = false), (query = ''))}
					>
						<Icon icon="mdi:close" class="h-4 w-4" />
					</button>
				{/if}
			</div>
			<input
				type="search"
				class="input input-bordered mb-2 w-full text-base-content"
				placeholder="Search exercises or muscles"
				bind:value={query}
			/>
			<ul class="max-h-[50vh] overflow-y-auto">
				{#each pickable as exercise (exercise.id)}
					<li>
						<button
							class="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-base-200 disabled:opacity-50"
							disabled={!!adding}
							on:click={() => addExercise(exercise.id)}
						>
							<span class="min-w-0 flex-1">
								<span class="block truncate text-base-content">{exercise.name}</span>
								<span class="block truncate text-xs opacity-50">{exercise.muscleGroup}</span>
							</span>
							{#if adding === exercise.id}
								<span class="loading loading-spinner loading-xs"></span>
							{:else}
								<Icon icon="codicon:add" class="h-4 w-4 opacity-60" />
							{/if}
						</button>
					</li>
				{:else}
					<li class="px-2 py-2 text-sm opacity-60">No matching exercises.</li>
				{/each}
			</ul>
		</section>
	{:else}
		<button class="btn btn-outline btn-block" on:click={() => (showPicker = true)}>
			<Icon icon="codicon:add" class="h-4 w-4" />
			Add exercise
		</button>
	{/if}
{:else}
	<!-- nothing in progress -->
	<h1 class="mb-4 px-1 text-2xl font-bold text-base-content">
		Today
		<span class="ml-2 text-base font-normal opacity-60">
			{new Date().toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
		</span>
	</h1>

	<StartWorkout workouts={orderedWorkouts} activeSession={null} />

	{#if data.recentSessions.length > 0}
		<section class="mt-8">
			<h2 class="mb-2 px-1 text-xl font-normal text-base-content">Recent</h2>
			<ul class="card bg-base-100">
				{#each data.recentSessions as s (s.id)}
					<li>
						<a
							href="/home/sessions/{s.id}"
							class="flex items-center gap-3 border-b border-base-200 px-3 py-3 transition-colors last:border-none hover:bg-base-200"
						>
							<span class="min-w-0 flex-1">
								<span class="block truncate font-medium text-base-content">{s.name}</span>
								<span class="block text-xs opacity-60">
									{fmtDate(s.startedAt)}
									· {fmtDurationLong(new Date(s.endedAt ?? s.startedAt).getTime() - new Date(s.startedAt).getTime())}
									· {s.setCount} set{s.setCount === 1 ? '' : 's'}
								</span>
							</span>
							<Icon icon="mdi:chevron-right" class="h-5 w-5 flex-shrink-0 opacity-40" />
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
{/if}
