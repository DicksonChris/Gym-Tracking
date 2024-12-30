<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import Counter from '$lib/components/Counter.svelte';
	import type { Exercise } from '$lib/api/exercises';
	import type { History } from '$lib/api/history';
	import { historiesStore, loadHistories } from '$lib/stores/historiesStore';

	export let exercise: Exercise;
	export let initialData: History | null = null;

	const dispatch = createEventDispatcher();

	let reps: number = initialData?.reps || exercise.defaultReps || 0;
	let weight: number = initialData?.weight || 0;
	let distance: string = initialData?.distance || '';
	let time: string = initialData?.time || '';

	// Derived store for exercise histories
	const exerciseHistories = derived(historiesStore, ($store) => $store[exercise.id] || []);

	let groupedHistory: Record<string, Record<string, History[]>> = {};

	let unsubscribe;

	onMount(() => {
		loadHistories(exercise.id);
		unsubscribe = exerciseHistories.subscribe((histories) => {
			if (histories.length > 0 && !initialData) {
				// Find the most recent history
				const mostRecent = histories.reduce((latest, current) =>
					new Date(current.startTime) > new Date(latest.startTime) ? current : latest
				);
				console.log(JSON.stringify(mostRecent));
				weight = mostRecent.weight; // Set weight from the most recent history
				reps = reps || exercise.defaultReps || mostRecent.reps || 0; // Set reps if not already set
			}
		});
		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	function handleSubmit() {
		const historyData: Partial<History> = {
			reps: reps || undefined,
			weight: weight || undefined,
			distance: distance || undefined,
			time: time || undefined
		};
		dispatch('submit', historyData);
	}

	function updateReps(event: CustomEvent<number>) {
		reps = event.detail;
	}

	function updateWeight(event: CustomEvent<number>) {
		weight = event.detail;
	}
</script>

{#if exercise}
	<header class="mb-8">
		<h2 class="text-2xl">{initialData ? 'Update' : 'Create'} {exercise.name} History</h2>
		{#if initialData}
			<p>{new Date(initialData.startTime).toLocaleString()}</p>
		{/if}
	</header>

	<form class="form-control flex flex-col" on:submit|preventDefault={handleSubmit}>
		{#if exercise.measurement?.includes('weight')}
			<div class="form-control">
				<label class="label text-2xl font-semibold" for="weight">WEIGHT (lbs)</label>
				<hr class="mb-8 border-secondary" />
				<Counter
					decimal
					bind:value={weight}
					step={2.5}
					min={0}
					max={1000}
					on:update={updateWeight}
				/>
			</div>
		{/if}

		{#if exercise.measurement?.includes('reps')}
			<div class="form-control">
				<label class="label text-2xl font-semibold" for="reps">REPS</label>
				<hr class="mb-8 border-secondary" />
				<Counter bind:value={reps} step={1} min={0} max={1000} on:update={updateReps} />
			</div>
		{/if}

		{#if exercise.measurement?.includes('distance')}
			<div class="form-control">
				<label class="label" for="distance">Distance</label>
				<input
					class="input input-bordered"
					type="text"
					id="distance"
					bind:value={distance}
					required
				/>
			</div>
		{/if}

		{#if exercise.measurement?.includes('time')}
			<div class="form-control">
				<label class="label" for="time">Time</label>
				<input class="input input-bordered" type="text" id="time" bind:value={time} required />
			</div>
		{/if}
		<button class="btn btn-primary btn-block fixed bottom-0 right-0 mt-4" type="submit">
			{initialData ? 'Update' : 'Submit'}
		</button>
	</form>
{/if}
