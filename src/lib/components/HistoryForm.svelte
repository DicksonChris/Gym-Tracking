<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { goto } from '$app/navigation'; // Import the goto function
	import Counter from '$lib/components/Counter.svelte';
	import type { Exercise } from '$lib/api/exercises';
	import type { History } from '$lib/api/history';
	import {
		historiesStore,
		loadHistories,
		saveHistory,
		deleteHistory
	} from '$lib/stores/historiesStore';

	export let exercise: Exercise;
	export let initialData: History | null = null;

	const dispatch = createEventDispatcher();

	let reps: number = initialData?.reps || exercise.defaultReps || 0;
	let weight: number = initialData?.weight || 0;
	let distance: string = initialData?.distance || '';
	let time: string = initialData?.time || '';

	// Modal visibility state
	let showDeleteModal: boolean = false;

	// Derived store for exercise histories
	const exerciseHistories = derived(historiesStore, ($store) => $store[exercise.id] || []);

	let unsubscribe: () => void;
	let isSubmitting: boolean = false; // Prevent multiple submissions

	onMount(() => {
		loadHistories(exercise.id);
		unsubscribe = exerciseHistories.subscribe((histories) => {
			if (histories.length > 0 && !initialData) {
				// Find the most recent history
				const mostRecent = histories.reduce((latest, current) =>
					new Date(current.startTime) > new Date(latest.startTime) ? current : latest
				);
				weight = mostRecent.weight || weight;
				reps = reps || exercise.defaultReps || mostRecent.reps || 0;
			}
		});
		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	async function handleSubmit() {
		if (isSubmitting) return; // Prevent multiple submissions
		isSubmitting = true;
		console.log('handleSubmit called');

		const historyData: Partial<History> = {
			reps: reps || undefined,
			weight: weight || undefined,
			distance: distance || undefined,
			time: time || undefined
			};
		
		// Validate data before submission
		if (!historyData.reps && !historyData.weight && !historyData.distance && !historyData.time) {
			console.warn('No data provided to create a history.');
			isSubmitting = false;
			return;
		}

		try {
			await saveHistory(exercise.id, historyData, initialData?.id);
			goto('/');
		} catch (error) {
			console.error('Error submitting form:', error);
			// Optionally, provide user feedback here
		} finally {
			isSubmitting = false;
		}
	}

	function openDeleteModal() {
		showDeleteModal = true;
	}

	async function confirmDelete() {
		if (initialData?.id) {
			await deleteHistory(exercise.id, initialData.id);
			goto('/'); // Redirect to the homepage
		}
	}

	function closeDeleteModal() {
		showDeleteModal = false;
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
		<div class="flex items-center justify-between">
			<h2 class="mr-4 inline-block h-6 whitespace-nowrap text-2xl font-medium text-base-content">
				{initialData ? 'Update' : 'Create'}
				{exercise.name} History
			</h2>

			{#if initialData}
				<!-- Delete history button -->
				<button class="btn btn-outline btn-error rounded-full" on:click={openDeleteModal}>
					<Icon icon="bi:trash" class="h-6 w-6" />
				</button>{/if}
		</div>
    
  <hr class="my-2 border-grey" />
		{#if initialData}
			<p class="text-primary">{new Date(initialData.startTime).toLocaleString()}</p>
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
					step={exercise.defaultStep || 0}
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
				<input class="input input-bordered" type="text" id="distance" bind:value={distance} />
			</div>
		{/if}

		{#if exercise.measurement?.includes('time')}
			<div class="form-control">
				<label class="label" for="time">Time</label>
				<input class="input input-bordered" type="text" id="time" bind:value={time} required />
			</div>
		{/if}
		<button class="btn btn-primary btn-block fixed bottom-0 right-0 rounded-none" type="submit">
			{initialData ? 'Update' : 'Submit'}
		</button>
	</form>

	<!-- Delete Confirmation Modal -->
	{#if showDeleteModal}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="text-lg font-bold">Confirm Deletion</h3>
				<p class="py-4">Are you sure you want to delete these reps?</p>
				<div class="modal-action grid grid-cols-2 gap-2">
					<button class="btn btn-block" on:click={closeDeleteModal}>Cancel</button>
					<button class="btn btn-block btn-error" on:click={confirmDelete}>Delete</button>
				</div>
			</div>
			<button class="modal-backdrop" on:click={closeDeleteModal} aria-label="Close modal"></button>
		</div>
	{/if}
{/if}
