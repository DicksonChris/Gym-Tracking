<script lang="ts">
	export const ssr = false;
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { loadWorkouts, workoutsStore } from '$lib/stores/workoutsStore';
	import { loadExercises } from '$lib/stores/exercisesStore';
	import ExerciseItem from '$lib/components/ExerciseItem.svelte';
	import Icon from '@iconify/svelte';
	import WorkoutDropdown from '$lib/components/WorkoutDropdown.svelte';
	import { selectedWorkoutsStore } from '$lib/stores/selectedWorkoutsStore';

	let workouts = [];
	$: workouts = $workoutsStore ?? [];
	let showList = false;
	let container: HTMLDivElement;

	let selectedWorkouts: string[] = [];
	const unsubscribe = selectedWorkoutsStore.subscribe((value) => {
		selectedWorkouts = value;
	});

	onMount(async () => {
		await loadWorkouts();
		if (typeof document !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
		}
		await loadExercises();
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
		unsubscribe();
	});

	function handleClickOutside(e: MouseEvent) {
		if (container && !container.contains(e.target as Node)) {
			showList = false;
		}
	}

	function handleClick(workoutID: string) {
		goto(`/workouts/${workoutID}`);
	}

	function handleSelectionChange(event) {
		selectedWorkoutsStore.set(event.detail);
	}

	$: orderedWorkouts = selectedWorkouts
		.map((id) => workouts.find((w) => w.id === id))
		.filter((w) => w);
</script>

<WorkoutDropdown {selectedWorkouts} on:selectionChange={handleSelectionChange} />

<ul class="space-y-6">
	{#each orderedWorkouts as workout, idx}
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
	{/each}
</ul>
