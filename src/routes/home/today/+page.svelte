<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import type { Exercise } from '$lib/api/exercises';
	import type { History } from '$lib/api/history';
	import type { Workout } from '$lib/api/workouts';

	export let data: {
		workouts: Workout[];
		exercises: Exercise[];
		selectedWorkouts: string[];
		histories: Record<string, History[]>;
	};

	$: orderedWorkouts = data.selectedWorkouts
		.map((id) => data.workouts.find((w) => w.id === id))
		.filter((w): w is Workout => w !== undefined);

	const todayKey = new Date().toDateString();

	function exerciseById(id: string): Exercise | null {
		return data.exercises.find((e) => e.id === id) ?? null;
	}

	function todaySets(exerciseId: string): History[] {
		return (data.histories[exerciseId] ?? []).filter(
			(h) => new Date(h.startTime).toDateString() === todayKey
		);
	}

	/** Sets from the most recent day before today. */
	function lastSession(exerciseId: string): History[] {
		const prior = (data.histories[exerciseId] ?? [])
			.filter((h) => new Date(h.startTime).toDateString() !== todayKey)
			.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
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

	function summary(sets: History[]): string {
		if (sets.length === 0) return '';
		return sets.map(fmtSet).join(', ');
	}

	function workoutProgress(workout: Workout): { done: number; total: number } {
		const ids = workout.exercises ?? [];
		const visible = ids.filter((id) => {
			const ex = exerciseById(id);
			return ex && !ex.hidden;
		});
		return {
			done: visible.filter((id) => todaySets(id).length > 0).length,
			total: visible.length
		};
	}
</script>

<h1 class="mb-4 text-2xl font-bold text-base-content">
	Today
	<span class="ml-2 text-base font-normal opacity-60">
		{new Date().toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
	</span>
</h1>

{#if orderedWorkouts.length === 0}
	<div class="card bg-base-100 p-8 text-center">
		<Icon icon="mdi:dumbbell" class="mx-auto mb-2 h-10 w-10 opacity-40" />
		<p class="text-base-content">No workouts selected.</p>
		<p class="mt-1 text-sm opacity-60">
			Pick your workouts on the <a href="/home" class="link link-secondary">home page</a> to use
			workout mode.
		</p>
	</div>
{:else}
	<div class="space-y-6">
		{#each orderedWorkouts as workout}
			{@const progress = workoutProgress(workout)}
			<section class="card bg-base-100">
				<div
					class="flex flex-row items-center justify-between rounded-t-2xl border-b border-primary p-3"
				>
					<h2 class="text-lg font-semibold text-white">{workout.groupName}</h2>
					<span
						class="badge {progress.done === progress.total && progress.total > 0
							? 'badge-success'
							: 'badge-neutral'}"
					>
						{progress.done}/{progress.total} done
					</span>
				</div>
				<ul>
					{#each workout.exercises ?? [] as exerciseID}
						{@const exercise = exerciseById(exerciseID)}
						{#if exercise && !exercise.hidden}
							{@const today = todaySets(exerciseID)}
							{@const last = lastSession(exerciseID)}
							<li>
								<button
									class="flex w-full items-center gap-3 border-b border-base-200 px-3 py-3 text-left transition-colors last:border-none hover:bg-base-200"
									on:click={() => goto(`/home/exercise/${exerciseID}`)}
								>
									{#if today.length > 0}
										<Icon icon="mdi:check-circle" class="h-6 w-6 flex-shrink-0 text-success" />
									{:else}
										<Icon
											icon="mdi:checkbox-blank-circle-outline"
											class="h-6 w-6 flex-shrink-0 opacity-30"
										/>
									{/if}
									<span class="min-w-0 flex-1">
										<span
											class="block overflow-hidden text-ellipsis whitespace-nowrap font-medium text-base-content"
										>
											{exercise.name}
										</span>
										<span class="block text-xs opacity-60">
											{#if today.length > 0}
												Today: {summary(today)}
											{:else if last.length > 0}
												Last: {summary(last)}
											{:else}
												First time — go get it 💪
											{/if}
										</span>
									</span>
									{#if today.length > 0}
										<span class="badge badge-primary badge-sm">{today.length}</span>
									{/if}
									<Icon icon="mdi:chevron-right" class="h-5 w-5 flex-shrink-0 opacity-40" />
								</button>
							</li>
						{/if}
					{/each}
				</ul>
			</section>
		{/each}
	</div>
{/if}
