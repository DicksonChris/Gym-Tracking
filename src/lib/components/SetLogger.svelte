<script lang="ts">
	import Icon from '@iconify/svelte';
	import Counter from '$lib/components/Counter.svelte';
	import type { Exercise } from '$lib/api/exercises';
	import type { History } from '$lib/api/history';
	import { startRestTimer, restOverrides } from '$lib/stores/restTimer';
	import { queueSet } from '$lib/offlineQueue';
	import { effectiveRest } from '$lib/rest';

	export let exercise: Exercise;
	export let histories: History[] = [];

	// most recent set overall (for defaults + repeat button)
	$: sorted = histories
		.slice()
		.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
	$: lastSet = sorted[0] ?? null;

	$: todayKey = new Date().toDateString();
	let todaySets: History[] = [];
	$: todaySets = sorted.filter((h) => new Date(h.startTime).toDateString() === todayKey);

	$: bestWeight = Math.max(0, ...histories.map((h) => h.weight ?? 0));
	$: bestReps = Math.max(0, ...histories.map((h) => h.reps ?? 0));

	let reps: number = 0;
	let weight: number = 0;
	let distance = '';
	let time = '';
	let note = '';
	let initialized = false;

	$: if (exercise && !initialized) {
		initialized = true;
		reps = lastSet?.reps ?? exercise.defaultReps ?? 0;
		weight = lastSet?.weight ?? 0;
		distance = lastSet?.distance ?? '';
		time = lastSet?.time ?? '';
	}

	$: rest = $restOverrides[exercise.id] ?? effectiveRest(exercise.restSeconds);

	function startRest() {
		startRestTimer(rest, exercise.id);
	}

	let logging = false;
	let toast: { kind: 'success' | 'pr' | 'queued' | 'error'; text: string } | null = null;
	let toastTimeout: ReturnType<typeof setTimeout>;

	function showToast(kind: 'success' | 'pr' | 'queued' | 'error', text: string) {
		toast = { kind, text };
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => (toast = null), kind === 'pr' ? 5000 : 3000);
	}

	async function logSet(payload: {
		reps?: number;
		weight?: number;
		distance?: string;
		time?: string;
		note?: string;
	}) {
		if (logging) return;
		const hasData = payload.reps || payload.weight || payload.distance || payload.time;
		if (!hasData) {
			showToast('error', 'Nothing to log — enter at least one value.');
			return;
		}
		logging = true;
		const body = {
			exercise: exercise.id,
			...payload,
			startTime: new Date().toISOString()
		};
		try {
			const res = await fetch('/api/history', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(body)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			histories = [...histories, data.record];
			note = '';
			if (data.isPR) {
				showToast(
					'pr',
					`🏆 New best: ${data.prType === 'weight' ? `${payload.weight} lbs` : `${payload.reps} reps`}!`
				);
			} else {
				showToast('success', 'Set logged');
			}
			startRest();
		} catch (err) {
			// network failure -> queue for later; anything else -> error
			if (err instanceof TypeError || !navigator.onLine) {
				queueSet(body);
				histories = [...histories, { ...body } as History];
				note = '';
				showToast('queued', 'Offline — set queued, will sync');
				startRest();
			} else {
				console.error('Failed to log set:', err);
				showToast('error', 'Failed to log set.');
			}
		} finally {
			logging = false;
		}
	}

	function submitCurrent() {
		logSet({
			reps: exercise.measurement?.includes('reps') ? reps : undefined,
			weight: exercise.measurement?.includes('weight') ? weight : undefined,
			distance: exercise.measurement?.includes('distance') ? distance || undefined : undefined,
			time: exercise.measurement?.includes('time') ? time || undefined : undefined,
			note: note || undefined
		});
	}

	function repeatLast() {
		if (!lastSet) return;
		logSet({
			reps: lastSet.reps,
			weight: lastSet.weight,
			distance: lastSet.distance,
			time: lastSet.time
		});
	}

	function fmtSet(h: History): string {
		if (h.reps && h.weight) return `${h.reps} × ${h.weight} lbs`;
		if (h.reps) return `${h.reps} reps`;
		if (h.weight) return `${h.weight} lbs`;
		return [h.time && `${h.time} min`, h.distance].filter(Boolean).join(' · ');
	}
</script>

<header class="mb-6">
	<div class="flex items-center justify-between">
		<h2 class="mr-4 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium">
			{exercise.name}
		</h2>
		{#if bestWeight > 0}
			<span class="badge badge-outline badge-lg text-nowrap" title="Personal record">
				🏆 {bestWeight} lbs
			</span>
		{:else if bestReps > 0}
			<span class="badge badge-outline badge-lg text-nowrap" title="Personal record">
				🏆 {bestReps} reps
			</span>
		{/if}
	</div>
	<hr class="border-grey my-2" />
	{#if lastSet}
		<p class="text-sm opacity-70">
			Last: {fmtSet(lastSet)} · {new Date(lastSet.startTime).toLocaleDateString()}
		</p>
	{/if}
</header>

{#if exercise.measurement?.includes('weight')}
	<div class="form-control">
		<label class="label text-2xl font-semibold" for="weight">WEIGHT (lbs)</label>
		<hr class="mb-8 border-secondary" />
		<Counter decimal bind:value={weight} step={exercise.defaultStep || 2.5} min={0} max={1000} />
	</div>
{/if}

{#if exercise.measurement?.includes('reps')}
	<div class="form-control">
		<label class="label text-2xl font-semibold" for="reps">REPS</label>
		<hr class="mb-8 border-secondary" />
		<Counter bind:value={reps} step={1} min={0} max={1000} />
	</div>
{/if}

{#if exercise.measurement?.includes('distance')}
	<div class="form-control">
		<label class="label" for="distance">Distance</label>
		<input id="distance" class="input input-bordered" type="text" bind:value={distance} />
	</div>
{/if}

{#if exercise.measurement?.includes('time')}
	<div class="form-control">
		<label class="label" for="time">Time</label>
		<input id="time" class="input input-bordered" type="text" bind:value={time} />
	</div>
{/if}

<!-- optional per-set note -->
<div class="form-control mt-4">
	<input
		id="note"
		class="input input-bordered input-sm"
		type="text"
		maxlength="500"
		placeholder="Note (optional) — e.g. felt easy"
		bind:value={note}
	/>
</div>

<!-- today's sets so far -->
{#if todaySets.length > 0}
	<div class="mt-4">
		<h3 class="text-sm font-semibold uppercase opacity-70">Today</h3>
		<ul class="mt-1 space-y-1">
			{#each todaySets as s, i}
				<li class="flex items-center gap-2 text-base-content">
					<span class="badge badge-neutral badge-sm">{todaySets.length - i}</span>
					<span>{fmtSet(s)}</span>
					{#if s.note}<span class="text-xs italic opacity-60">“{s.note}”</span>{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<!-- toast -->
{#if toast}
	<div class="toast toast-center toast-top z-50 mt-16">
		<div
			class="alert {toast.kind === 'pr'
				? 'alert-warning'
				: toast.kind === 'error'
					? 'alert-error'
					: toast.kind === 'queued'
						? 'alert-info'
						: 'alert-success'} shadow-lg"
		>
			<span class="font-semibold">{toast.text}</span>
		</div>
	</div>
{/if}

<!-- actions -->
<div class="fixed bottom-0 right-0 flex w-full bg-base-200 pb-[env(safe-area-inset-bottom)]">
	{#if lastSet}
		<button
			class="btn btn-secondary flex-1 rounded-none"
			type="button"
			disabled={logging}
			on:click={repeatLast}
			title="Log the same set as last time"
		>
			<Icon icon="mdi:repeat" class="h-5 w-5" />
			Same as last
		</button>
	{/if}
	<button
		class="btn btn-primary flex-[2] rounded-none"
		type="button"
		disabled={logging}
		on:click={submitCurrent}
	>
		{#if logging}
			<span class="loading loading-spinner loading-sm"></span>
		{/if}
		Log set
	</button>
</div>
