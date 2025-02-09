<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	import WorkoutDropdown from '$lib/components/WorkoutDropdown.svelte';
	import ExerciseItem from '$lib/components/ExerciseItem.svelte';

	import { workoutsStore } from '$lib/stores/workoutsStore';
	import { selectedWorkoutsStore } from '$lib/stores/selectedWorkoutsStore';
	import type { Workout } from '$lib/api/workouts';
	import ShinyCardTitle from '$lib/components/ShinyCardTitle.svelte';
	import ShinyMenuButton from '$lib/components/ShinyMenuButton.svelte';

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
<WorkoutDropdown {workouts} {selectedWorkouts} on:selectionChange={handleSelectionChange} />

<ul class="space-y-6" bind:this={container}>
	{#each orderedWorkouts as workout}
		{#if workout}
			<li class="card mb-12">
				<ShinyCardTitle className="z-[1]">
					<h2 class="linear-text-gradient card-title ml-2 text-5xl md:text-xl lg:text-2xl">
						{workout.groupName}
					</h2>
					<button on:click={() => handleClick(workout.id)} aria-label="Edit workout">
						<!-- <Icon icon="bi:three-dots-vertical" class="h-6 w-8" /> -->
						<ShinyMenuButton><div></div></ShinyMenuButton>
					</button>
				</ShinyCardTitle>

				<ul>
					{#if workout.exercises}
						<div
							class="inline-block
         w-full rounded-b-2xl bg-gradient-to-b
         from-[#cda197] via-[#f3e2b4] to-[#cda197] px-0.5 pb-0.5"
						>
							<div
								class="bg-gradient-to-tr rounded-b-2xl 
             from-[#f7e7b5]
						 via-[#ebdeb0]
             to-[#eedfb0]"
							>
								{#each workout.exercises as exerciseID, index}
									<ExerciseItem
										{exerciseID}
										index={index + 1 === workout.exercises.length ? -1 : index}
									/>
								{/each}
							</div>
						</div>
					{/if}
				</ul>
			</li>
		{/if}
	{/each}
</ul>

<style>
	.linear-text-gradient {
		background: linear-gradient(to top, #f0fdff, #ebf8fa, rgb(252, 251, 235), white);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
</style>
