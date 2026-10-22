<script lang="ts">
	import Icon from '@iconify/svelte';
	import ElapsedClock from '$lib/components/ElapsedClock.svelte';
	import { startWorkout } from '$lib/sessionClient';
	import type { Workout } from '$lib/api/workouts';
	import type { Session } from '$lib/api/sessions';

	/** Workouts offered as routines (usually the user's selected ones, in order). */
	export let workouts: Workout[] = [];
	export let activeSession: Session | null = null;

	let starting: string | null = null;

	async function start(workoutId?: string) {
		if (starting) return;
		starting = workoutId ?? 'empty';
		try {
			await startWorkout(workoutId);
		} catch (err) {
			console.error('Failed to start workout:', err);
			alert('Failed to start workout.');
		} finally {
			starting = null;
		}
	}
</script>

{#if activeSession}
	<a
		href="/home/today"
		class="flex items-center gap-3 rounded-box border border-primary bg-base-100 p-3 transition-colors hover:bg-base-300"
	>
		<span class="relative flex h-3 w-3 flex-shrink-0">
			<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"
			></span>
			<span class="relative inline-flex h-3 w-3 rounded-full bg-success"></span>
		</span>
		<span class="min-w-0 flex-1">
			<span class="block truncate font-medium text-base-content">{activeSession.name}</span>
			<span class="block text-xs opacity-60">
				In progress · <ElapsedClock startedAt={activeSession.startedAt} />
			</span>
		</span>
		<span class="btn btn-primary btn-sm">Resume</span>
	</a>
{:else}
	<section class="px-1">
		<h2 class="text-xl font-normal text-base-content">Start</h2>
		<ul class="mt-3 space-y-2">
			{#each workouts as workout (workout.id)}
				<li>
					<button
						type="button"
						class="flex items-center gap-2 text-left text-info hover:underline disabled:opacity-50"
						disabled={!!starting}
						on:click={() => start(workout.id)}
					>
						{#if starting === workout.id}
							<span class="loading loading-spinner loading-xs"></span>
						{:else}
							<Icon icon="codicon:play" class="h-4 w-4 flex-shrink-0" />
						{/if}
						{workout.groupName}
						<span class="text-xs text-base-content opacity-40">
							{workout.exercises?.length ?? 0} exercises
						</span>
					</button>
				</li>
			{/each}
			<li>
				<button
					type="button"
					class="flex items-center gap-2 text-info hover:underline disabled:opacity-50"
					disabled={!!starting}
					on:click={() => start()}
				>
					{#if starting === 'empty'}
						<span class="loading loading-spinner loading-xs"></span>
					{:else}
						<Icon icon="codicon:add" class="h-4 w-4 flex-shrink-0" />
					{/if}
					Empty workout
					<span class="text-xs text-base-content opacity-40">pick exercises as you go</span>
				</button>
			</li>
			<slot />
		</ul>
	</section>
{/if}
