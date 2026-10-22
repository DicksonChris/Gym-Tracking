<script lang="ts">
	import { fmtDurationLong } from '$lib/sessionClient';
	import type { History } from '$lib/api/history';

	export let data;

	$: ({ session, summary, totals } = data);

	function fmtSet(h: History): string {
		if (h.reps && h.weight) return `${h.reps} × ${h.weight}`;
		if (h.reps) return `${h.reps} reps`;
		if (h.weight) return `${h.weight} lbs`;
		return [h.time && `${h.time} min`, h.distance].filter(Boolean).join(' · ');
	}
</script>

<div class="px-1">
	<p class="text-sm opacity-60">
		{new Date(session.startedAt).toLocaleDateString('default', {
			weekday: 'long',
			month: 'short',
			day: 'numeric'
		})}
		· {new Date(session.startedAt).toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' })}
	</p>
	<h1 class="text-2xl font-bold text-base-content">{session.name}</h1>
</div>

<div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
	<div class="rounded-box bg-base-100 p-3">
		<div class="text-xs uppercase opacity-60">Duration</div>
		<div class="text-lg font-bold text-base-content">{fmtDurationLong(totals.durationMs)}</div>
	</div>
	<div class="rounded-box bg-base-100 p-3">
		<div class="text-xs uppercase opacity-60">Sets</div>
		<div class="text-lg font-bold text-base-content">{totals.sets}</div>
	</div>
	<div class="rounded-box bg-base-100 p-3">
		<div class="text-xs uppercase opacity-60">Volume</div>
		<div class="text-lg font-bold text-base-content">
			{totals.volume.toLocaleString()}<span class="ml-1 text-xs font-normal opacity-60">lbs</span>
		</div>
	</div>
	<div class="rounded-box bg-base-100 p-3">
		<div class="text-xs uppercase opacity-60">PRs</div>
		<div class="text-lg font-bold {totals.prs > 0 ? 'text-warning' : 'text-base-content'}">
			{totals.prs}
		</div>
	</div>
</div>

{#if summary.length === 0}
	<p class="mt-6 px-1 text-sm opacity-60">No sets were logged in this workout.</p>
{:else}
	<ul class="card mt-4 bg-base-100">
		{#each summary as ex (ex.id)}
			<li class="border-b border-base-200 px-3 py-3 last:border-none">
				<div class="flex items-center gap-2">
					<a href="/home/exercise/{ex.id}" class="min-w-0 flex-1 truncate font-medium text-base-content hover:underline">
						{ex.name}
					</a>
					{#if ex.isPR}
						<span class="badge badge-warning badge-sm text-nowrap">🏆 {ex.bestWeight} lbs</span>
					{/if}
				</div>
				<p class="mt-1 text-sm opacity-70">{ex.sets.map(fmtSet).join(', ')}</p>
				{#if ex.sets.some((s) => s.note)}
					<p class="mt-1 text-xs italic opacity-50">
						{ex.sets.filter((s) => s.note).map((s) => `“${s.note}”`).join(' ')}
					</p>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<a href="/home" class="btn btn-primary btn-block mt-6">Done</a>
