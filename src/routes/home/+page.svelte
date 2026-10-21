<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	import WorkoutDropdown from '$lib/components/WorkoutDropdown.svelte';
	import ExerciseItem from '$lib/components/ExerciseItem.svelte';

	import type { Exercise } from '$lib/api/exercises';
	import type { History } from '$lib/api/history';
	import type { Workout } from '$lib/api/workouts';

	export let data: {
		workouts: Workout[];
		exercises: Exercise[];
		selectedWorkouts: string[];
		histories: Record<string, History[]>;
	};

	$: workouts = data.workouts ?? [];

	// Local selection state, initialized from the server and synced back
	// explicitly on change (never on load, so it can't wipe saved data).
	let selectedWorkouts: string[] = data.selectedWorkouts ?? [];

	function exerciseById(id: string): Exercise | null {
		return data.exercises.find((e) => e.id === id) ?? null;
	}

	function handleClick(workoutID: string) {
		goto(`/home/workouts/${workoutID}`);
	}

	/** When WorkoutDropdown updates its selection, persist it to the server. */
	async function handleSelectionChange(event: CustomEvent<string[]>) {
		const previous = selectedWorkouts;
		selectedWorkouts = event.detail;
		try {
			const res = await fetch('/api/selectedWorkouts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ workouts: selectedWorkouts })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
		} catch (err) {
			console.error('Failed to save workout selection:', err);
			selectedWorkouts = previous;
			alert('Failed to save workout selection.');
		}
	}

	/**
	 * We reorder workouts according to the order in selectedWorkouts
	 */
	$: orderedWorkouts = selectedWorkouts
		.map((id) => workouts.find((w) => w.id === id))
		.filter((w): w is Workout => w !== undefined);
</script>

<!-- 
  Pass the SSR "workouts" to WorkoutDropdown,
  along with the current "selectedWorkouts" array 
-->
<WorkoutDropdown
	workouts={workouts}
	{selectedWorkouts}
	on:selectionChange={handleSelectionChange}
/>

{#if workouts.length === 0}
	<div class="card mt-6 bg-base-100 p-8 text-center">
		<Icon icon="mdi:dumbbell" class="mx-auto mb-2 h-10 w-10 opacity-40" />
		<p class="text-base-content">Welcome! You don't have any workouts yet.</p>
		<a href="/home/workouts/new" class="btn btn-primary mx-auto mt-4">Create your first workout</a>
	</div>
{:else if selectedWorkouts.length === 0}
	<div class="card mt-6 bg-base-100 p-8 text-center">
		<Icon icon="mdi:arrow-up" class="mx-auto mb-2 h-10 w-10 animate-bounce opacity-40" />
		<p class="text-base-content">Pick your workouts above to get started 👆</p>
		<p class="mt-1 text-sm opacity-60">Selected workouts show up here with your history.</p>
	</div>
{/if}

<ul class="space-y-6">
	{#each orderedWorkouts as workout}
		{#if workout}
			<li class="card mb-12">
				<div
					class="workout-header card flex flex-row items-center justify-between rounded-b-none border-b-[1px] border-primary bg-base-100 p-2 text-white"
				>
					<h2 class="card-title ml-2 md:text-xl lg:text-2xl">
						{workout.groupName}
					</h2>
					<button on:click={() => handleClick(workout.id)} aria-label="Edit workout">
						<Icon icon="bi:three-dots-vertical" class="h-6 w-8" />
					</button>
				</div>

				<ul>
					{#if workout.exercises}
						{#each workout.exercises as exerciseID, index}
							<ExerciseItem
								exercise={exerciseById(exerciseID)}
								histories={data.histories[exerciseID] ?? []}
								index={index + 1 === workout.exercises.length ? -1 : index}
							/>
						{/each}
					{/if}
				</ul>
			</li>
		{/if}
	{/each}
</ul>