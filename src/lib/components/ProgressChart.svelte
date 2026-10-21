<script lang="ts">
	import type { History } from '$lib/api/history';

	export let histories: History[] = [];
	export let measurement: string[] = [];

	// Chart the primary metric: weight if tracked, otherwise reps.
	$: metric = measurement.includes('weight') ? 'weight' : measurement.includes('reps') ? 'reps' : null;

	interface Point {
		day: string; // YYYY-MM-DD
		time: number;
		value: number;
	}

	// Best (max) value per day, in chronological order.
	$: points = metric
		? Object.values(
				histories.reduce<Record<string, Point>>((acc, h) => {
					const v = metric === 'weight' ? h.weight : h.reps;
					if (!v) return acc;
					const d = new Date(h.startTime);
					if (isNaN(d.getTime())) return acc;
					const day = d.toISOString().slice(0, 10);
					if (!acc[day] || v > acc[day].value) {
						acc[day] = { day, time: d.getTime(), value: v };
					}
					return acc;
				}, {})
			).sort((a, b) => a.time - b.time)
		: [];

	const W = 320;
	const H = 120;
	const PAD = { top: 14, right: 10, bottom: 18, left: 34 };

	$: xMin = points.length ? points[0].time : 0;
	$: xMax = points.length ? points[points.length - 1].time : 1;
	$: yMax = points.length ? Math.max(...points.map((p) => p.value)) : 1;
	$: yMin = points.length ? Math.min(...points.map((p) => p.value)) : 0;
	// Pad the y range a little so the line isn't glued to the edges.
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

	$: path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.time).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');

	function shortDate(t: number): string {
		return new Date(t).toLocaleDateString('default', { month: 'short', day: 'numeric' });
	}

	$: unit = metric === 'weight' ? 'lbs' : 'reps';
</script>

{#if points.length >= 2}
	<div class="my-2 rounded-lg bg-base-200 p-2">
		<svg viewBox="0 0 {W} {H}" class="w-full" role="img" aria-label="Progress chart ({unit})">
			<!-- y-axis labels -->
			<text x={PAD.left - 6} y={y(yMax) + 4} text-anchor="end" class="fill-base-content text-[10px] opacity-70">
				{yMax}
			</text>
			{#if yMin !== yMax}
				<text x={PAD.left - 6} y={y(yMin) + 4} text-anchor="end" class="fill-base-content text-[10px] opacity-70">
					{yMin}
				</text>
			{/if}

			<!-- guide lines -->
			<line x1={PAD.left} y1={y(yMax)} x2={W - PAD.right} y2={y(yMax)} class="stroke-base-content opacity-10" stroke-dasharray="3 3" />
			{#if yMin !== yMax}
				<line x1={PAD.left} y1={y(yMin)} x2={W - PAD.right} y2={y(yMin)} class="stroke-base-content opacity-10" stroke-dasharray="3 3" />
			{/if}

			<!-- the line -->
			<path d={path} fill="none" class="stroke-secondary" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

			<!-- points -->
			{#each points as p}
				<circle cx={x(p.time)} cy={y(p.value)} r="2.5" class="fill-secondary" />
			{/each}

			<!-- x-axis labels -->
			<text x={PAD.left} y={H - 4} class="fill-base-content text-[10px] opacity-70">{shortDate(xMin)}</text>
			<text x={W - PAD.right} y={H - 4} text-anchor="end" class="fill-base-content text-[10px] opacity-70">
				{shortDate(xMax)}
			</text>
		</svg>
		<p class="px-1 text-xs text-base-content opacity-60">Best {unit} per day</p>
	</div>
{/if}
