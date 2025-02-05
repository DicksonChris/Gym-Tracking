<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	import WorkoutDropdown from '$lib/components/WorkoutDropdown.svelte';
	import ExerciseItem from '$lib/components/ExerciseItem.svelte';

	import { workoutsStore } from '$lib/stores/workoutsStore';
	import { selectedWorkoutsStore } from '$lib/stores/selectedWorkoutsStore';
	import type { Workout } from '$lib/api/workouts';

	// The SSR data has "workouts" already. We'll store them in a local var or read from the store.
	let workouts: Workout[] = [];

	// We have an SSR-based store. If you like, you can read from that:
	$: workouts = $workoutsStore ?? [];

	let showList = false;
	let container: HTMLUListElement | null = null;
	let selectedWorkouts: string[] = [];

	// Sync with the selectedWorkouts store
	const unsubscribe = selectedWorkoutsStore.subscribe((value) => {
		selectedWorkouts = value;
	});

	onDestroy(() => {
		unsubscribe();
	});

	function handleClickOutside(e: MouseEvent) {
		if (container && !container.contains(e.target as Node)) {
			showList = false;
		}
	}

	function handleClick(workoutID: string) {
		goto(`/home/workouts/${workoutID}`);
	}

	/** When WorkoutDropdown updates its selection, we store that in selectedWorkoutsStore */
	function handleSelectionChange(event: CustomEvent<string[]>) {
		selectedWorkoutsStore.set(event.detail);
	}

	/**
	 * We reorder workouts according to the order in selectedWorkouts
	 */
	$: orderedWorkouts = selectedWorkouts
		.map((id) => workouts.find((w) => w.id === id))
		.filter((w) => w !== undefined);
</script>

<svelte:window on:click={handleClickOutside} />

<!-- 
  Pass the SSR "workouts" to WorkoutDropdown,
  along with the current "selectedWorkouts" array 
-->
<WorkoutDropdown
	workouts={workouts}
	{selectedWorkouts}
	on:selectionChange={handleSelectionChange}
/>

<ul class="space-y-6" bind:this={container}>
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
								{exerciseID}
								index={index + 1 === workout.exercises.length ? -1 : index}
							/>
						{/each}
					{/if}
				</ul>
			</li>
		{/if}
	{/each}
</ul>