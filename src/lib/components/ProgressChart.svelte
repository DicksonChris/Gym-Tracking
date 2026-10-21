<script lang="ts">
	import type { History } from '$lib/api/history';

	export let histories: History[] = [];
	export let measurement: string[] = [];

	const DAY = 24 * 60 * 60 * 1000;

	$: hasWeight = measurement.includes('weight');
	$: hasReps = measurement.includes('reps');

	type Metric = 'weight' | 'e1rm' | 'volume' | 'reps';
	let metric: Metric = 'weight';
	let initialized = false;
	$: if (!initialized && measurement.length) {
		metric = hasWeight ? 'weight' : 'reps';
		initialized = true;
	}

	$: metricOptions = hasWeight
		? ([
				['weight', 'Best'],
				...(hasReps ? ([['e1rm', 'e1RM'], ['volume', 'Volume']] as [Metric, string][]) : [])
			] as [Metric, string][])
		: hasReps
			? ([['reps', 'Reps']] as [Metric, string][])
			: [];

	let rangeDays = 0; // 0 = all
	const RANGES: [number, string][] = [
		[30, '30d'],
		[90, '90d'],
		[0, 'All']
	];

	function setValue(h: History): number {
		const w = h.weight ?? 0;
		const r = h.reps ?? 0;
		switch (metric) {
			case 'weight':
				return w;
			case 'e1rm':
				// Epley estimated one-rep max
				return r > 0 ? Math.round(w * (1 + r / 30)) : w;
			case 'volume':
				return w * r;
			case 'reps':
				return r;
		}
	}

	interface Point {
		day: string;
		time: number;
		value: number;
		sets: History[];
	}

	$: cutoff = rangeDays > 0 ? Date.now() - rangeDays * DAY : 0;

	// Per-day aggregate: max for weight/e1rm/reps, sum for volume.
	$: points = (() => {
		const byDay = new Map<string, Point>();
		for (const h of histories) {
			const d = new Date(h.startTime);
			if (isNaN(d.getTime()) || d.getTime() < cutoff) continue;
			const v = setValue(h);
			if (!v) continue;
			const day = d.toISOString().slice(0, 10);
			const existing = byDay.get(day);
			if (!existing) {
				byDay.set(day, { day, time: d.getTime(), value: v, sets: [h] });
			} else {
				existing.sets.push(h);
				existing.value = metric === 'volume' ? existing.value + v : Math.max(existing.value, v);
			}
		}
		return [...byDay.values()].sort((a, b) => a.time - b.time);
	})();

	let selected: Point | null = null;
	// clear the selection when the dataset changes
	$: if (metric || rangeDays || histories) selected = null;

	const W = 320;
	const H = 120;
	const PAD = { top: 14, right: 10, bottom: 18, left: 38 };

	$: xMin = points.length ? points[0].time : 0;
	$: xMax = points.length ? points[points.length - 1].time : 1;
	$: yMax = points.length ? Math.max(...points.map((p) => p.value)) : 1;
	$: yMin = points.length ? Math.min(...points.map((p) => p.value)) : 0;
	$: ySpan = Math.max(yMax - yMin, 1);
	$: yLo = Math.max(0, yMin - ySpan * 0.15);
	$: yHi = yMax + ySpan * 0.15;

	function x(t: number): number {
		if (xMax === xMin) return (W - PAD.left - PAD.right) / 2 + PAD.left;
		return PAD.left + ((t - xMin) / (xMax - xMin)) * (W - PAD.left - PAD.right);
	}
	function y(v: number): number {
		return H - PAD.bottom - ((v - yLo) / (yHi - yLo)) * (H - PAD.top - PAD.bottom);
	}

	$: path = points
		.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.time).toFixed(1)},${y(p.value).toFixed(1)}`)
		.join(' ');

	function shortDate(t: number): string {
		return new Date(t).toLocaleDateString('default', { month: 'short', day: 'numeric' });
	}

	$: unit =
		metric === 'reps' ? 'reps' : metric === 'volume' ? 'lbs total' : 'lbs';

	function fmtSet(h: History): string {
		if (h.reps && h.weight) return `${h.reps} × ${h.weight} lbs`;
		if (h.reps) return `${h.reps} reps`;
		if (h.weight) return `${h.weight} lbs`;
		return [h.time && `${h.time} min`, h.distance].filter(Boolean).join(' · ');
	}
</script>

{#if points.length >= 2 || (points.length >= 1 && rangeDays > 0)}
	<div class="my-2 rounded-lg bg-base-200 p-2">
		<div class="mb-1 flex items-center justify-between gap-2">
			{#if metricOptions.length > 1}
				<div class="join">
					{#each metricOptions as [value, label]}
						<button
							class="btn join-item btn-xs {metric === value ? 'btn-primary' : 'btn-neutral'}"
							on:click={() => (metric = value)}
						>
							{label}
						</button>
					{/each}
				</div>
			{:else}
				<span class="text-xs opacity-60">{unit}</span>
			{/if}
			<div class="join">
				{#each RANGES as [days, label]}
					<button
						class="btn join-item btn-xs {rangeDays === days ? 'btn-primary' : 'btn-neutral'}"
						on:click={() => (rangeDays = days)}
					>
						{label}
					</button>
				{/each}
			</div>
		</div>

		{#if points.length === 0}
			<p class="py-6 text-center text-sm opacity-60">No sets in this range.</p>
		{:else}
			<svg viewBox="0 0 {W} {H}" class="w-full" role="img" aria-label="Progress chart ({unit})">
				<text
					x={PAD.left - 6}
					y={y(yMax) + 4}
					text-anchor="end"
					class="fill-base-content text-[10px] opacity-70"
				>
					{yMax}
				</text>
				{#if yMin !== yMax}
					<text
						x={PAD.left - 6}
						y={y(yMin) + 4}
						text-anchor="end"
						class="fill-base-content text-[10px] opacity-70"
					>
						{yMin}
					</text>
				{/if}

				<line
					x1={PAD.left}
					y1={y(yMax)}
					x2={W - PAD.right}
					y2={y(yMax)}
					class="stroke-base-content opacity-10"
					stroke-dasharray="3 3"
				/>
				{#if yMin !== yMax}
					<line
						x1={PAD.left}
						y1={y(yMin)}
						x2={W - PAD.right}
						y2={y(yMin)}
						class="stroke-base-content opacity-10"
						stroke-dasharray="3 3"
					/>
				{/if}

				<path
					d={path}
					fill="none"
					class="stroke-secondary"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>

				{#each points as p}
					<circle
						cx={x(p.time)}
						cy={y(p.value)}
						r={selected?.day === p.day ? 5 : 3}
						class="{selected?.day === p.day
							? 'fill-primary'
							: 'fill-secondary'} cursor-pointer"
						role="button"
						tabindex="0"
						aria-label="Show sets for {shortDate(p.time)}"
						on:click={() => (selected = selected?.day === p.day ? null : p)}
						on:keydown={(e) =>
							e.key === 'Enter' && (selected = selected?.day === p.day ? null : p)}
					/>
				{/each}

				<text x={PAD.left} y={H - 4} class="fill-base-content text-[10px] opacity-70">
					{shortDate(xMin)}
				</text>
				<text
					x={W - PAD.right}
					y={H - 4}
					text-anchor="end"
					class="fill-base-content text-[10px] opacity-70"
				>
					{shortDate(xMax)}
				</text>
			</svg>

			{#if selected}
				<div class="mx-1 mb-1 rounded bg-base-100 p-2 text-sm">
					<div class="mb-1 flex items-baseline justify-between">
						<span class="font-semibold text-base-content">
							{new Date(selected.time).toLocaleDateString('default', {
								weekday: 'short',
								month: 'short',
								day: 'numeric'
							})}
						</span>
						<span class="text-xs opacity-60">{selected.value} {unit}</span>
					</div>
					<ul class="space-y-0.5">
						{#each selected.sets.slice().sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) as s}
							<li class="flex items-center gap-2">
								<span>{fmtSet(s)}</span>
								{#if s.note}<span class="text-xs italic opacity-60">“{s.note}”</span>{/if}
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<p class="px-1 text-xs text-base-content opacity-60">
					{metric === 'volume' ? 'Total' : 'Best'} {unit} per day · tap a point for that day's sets
				</p>
			{/if}
		{/if}
	</div>
{/if}
