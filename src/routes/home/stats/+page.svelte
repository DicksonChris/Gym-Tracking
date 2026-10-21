<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Exercise } from '$lib/api/exercises';
	import type { History } from '$lib/api/history';

	export let data: { exercises: Exercise[]; histories: History[] };

	const DAY = 24 * 60 * 60 * 1000;
	const now = Date.now();

	$: exByIdGroups = new Map(
		data.exercises.map((e) => [
			e.id,
			(e.muscleGroup ?? '')
				.split(',')
				.map((g) => g.trim())
				.filter(Boolean)
		])
	);

	interface GroupRow {
		group: string;
		thisWeek: number;
		lastWeek: number;
	}

	$: rows = (() => {
		const acc = new Map<string, { thisWeek: number; lastWeek: number }>();
		for (const h of data.histories) {
			const t = new Date(h.startTime).getTime();
			const age = now - t;
			if (age > 14 * DAY || age < 0) continue;
			const bucket = age <= 7 * DAY ? 'thisWeek' : 'lastWeek';
			for (const group of exByIdGroups.get(h.exercise) ?? []) {
				const row = acc.get(group) ?? { thisWeek: 0, lastWeek: 0 };
				row[bucket]++;
				acc.set(group, row);
			}
		}
		return [...acc.entries()]
			.map(([group, counts]): GroupRow => ({ group, ...counts }))
			.sort((a, b) => b.thisWeek - a.thisWeek || b.lastWeek - a.lastWeek);
	})();

	$: maxSets = Math.max(1, ...rows.map((r) => Math.max(r.thisWeek, r.lastWeek)));

	$: totalThis = rows.reduce((s, r) => s + r.thisWeek, 0);
	$: totalLast = rows.reduce((s, r) => s + r.lastWeek, 0);

	function trend(r: GroupRow): string {
		if (r.thisWeek > r.lastWeek) return '↑';
		if (r.thisWeek < r.lastWeek) return '↓';
		return '→';
	}
</script>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-bold text-base-content">Stats</h1>
	<a href="/api/export" class="btn btn-outline btn-sm" download>
		<Icon icon="mdi:download" class="h-4 w-4" />
		Export CSV
	</a>
</div>

<div class="card mt-4 bg-base-100 p-4">
	<h2 class="mb-1 font-semibold text-base-content">Sets per muscle group</h2>
	<p class="mb-4 text-sm opacity-60">
		Last 7 days ({totalThis} sets) vs previous 7 days ({totalLast} sets)
	</p>

	{#if rows.length === 0}
		<div class="py-8 text-center">
			<Icon icon="mdi:chart-bar" class="mx-auto mb-2 h-10 w-10 opacity-40" />
			<p class="opacity-70">No sets logged in the last two weeks.</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each rows as row}
				<div>
					<div class="mb-1 flex items-baseline justify-between text-sm">
						<span class="font-medium text-base-content">{row.group}</span>
						<span class="opacity-70">
							{row.thisWeek} vs {row.lastWeek}
							<span
								class={row.thisWeek > row.lastWeek
									? 'text-success'
									: row.thisWeek < row.lastWeek
										? 'text-error'
										: 'opacity-50'}
							>
								{trend(row)}
							</span>
						</span>
					</div>
					<div class="flex flex-col gap-1">
						<div class="h-3 w-full overflow-hidden rounded bg-base-200">
							<div
								class="h-full rounded bg-primary"
								style="width: {(row.thisWeek / maxSets) * 100}%"
							></div>
						</div>
						<div class="h-3 w-full overflow-hidden rounded bg-base-200">
							<div
								class="h-full rounded bg-base-content opacity-25"
								style="width: {(row.lastWeek / maxSets) * 100}%"
							></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="mt-4 flex gap-4 text-xs opacity-60">
			<span class="flex items-center gap-1">
				<span class="inline-block h-2 w-4 rounded bg-primary"></span> this week
			</span>
			<span class="flex items-center gap-1">
				<span class="inline-block h-2 w-4 rounded bg-base-content opacity-40"></span> last week
			</span>
		</div>
	{/if}
</div>
