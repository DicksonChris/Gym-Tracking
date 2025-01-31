<script lang="ts">
	import Icon from '@iconify/svelte';
	import Counter from '$lib/components/Counter.svelte';
	import type { Exercise } from '$lib/api/exercises';
	import type { History } from '$lib/api/history';
	import { enhance } from '$app/forms';

	export let exercise: Exercise;
	export let initialData: History | null = null;
	export let lastHistory: History | null = null;

	let reps: number = initialData?.reps ?? exercise.defaultReps ?? 0;
	let weight: number;
	let distance: string;
	let time: string;

	const isUpdate = !!initialData;

	$: weight = (
		isUpdate
			? (initialData?.weight)
			: (lastHistory?.weight)
	) ?? 0;

	$: distance = (
		isUpdate
			? (initialData?.distance)
			: (lastHistory?.distance)
	) ?? '';

	$: time = (
		isUpdate
			? (initialData?.time)
			: (lastHistory?.time)
	) ?? '';

	let showDeleteModal = false;

	function openDeleteModal() {
		showDeleteModal = true;
	}
	function closeDeleteModal() {
		showDeleteModal = false;
	}
</script>

{#if exercise}
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<h2 class="mr-4 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium">
				{initialData ? 'Update' : 'Create'}
				{exercise.name} History
			</h2>
			{#if initialData}
				<!-- We'll handle delete in a separate route or action if you want. -->
				<button class="btn btn-outline btn-error rounded-full" on:click={openDeleteModal}>
					<Icon icon="bi:trash" class="h-6 w-6" />
				</button>
			{/if}
		</div>
		<hr class="border-grey my-2" />
		{#if initialData}
			<p>{new Date(initialData.startTime).toLocaleString()}</p>
		{/if}
	</header>

	<!-- 
		We do method="POST" to trigger the default action 
		in the route's +page.server.ts for create or update 
	-->
	<form method="POST" action="?/upsert" use:enhance>

		{#if exercise.measurement?.includes('weight')}
			<div class="form-control">
				<label class="label text-2xl font-semibold" for="weight">WEIGHT (lbs)</label>
				<hr class="mb-8 border-secondary" />
				<Counter decimal bind:value={weight} step={exercise.defaultStep || 0} min={0} max={1000} />
				<input type="hidden" name="weight" value={weight} />
			</div>
		{/if}

		{#if exercise.measurement?.includes('reps')}
			<div class="form-control">
				<label class="label text-2xl font-semibold" for="reps">REPS</label>
				<hr class="mb-8 border-secondary" />
				<Counter bind:value={reps} step={1} min={0} max={1000} />
				<input type="hidden" name="reps" value={reps} />
			</div>
		{/if}

		{#if exercise.measurement?.includes('distance')}
			<div class="form-control">
				<label class="label" for="distance">Distance</label>
				<input
					id="distance"
					name="distance"
					class="input input-bordered"
					type="text"
					bind:value={distance}
				/>
			</div>
		{/if}

		{#if exercise.measurement?.includes('time')}
			<div class="form-control">
				<label class="label" for="time">Time</label>
				<input id="time" name="time" class="input input-bordered" type="text" bind:value={time} />
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

				<form method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="historyId" value={initialData?.id} />
					<div class="modal-action grid grid-cols-2 gap-2">
						<button class="btn btn-block" on:click={closeDeleteModal} type="button">Cancel</button>
						<button class="btn btn-error btn-block" type="submit">Delete</button>
					</div>
				</form>
			</div>
			<button class="modal-backdrop" on:click={closeDeleteModal} aria-label="Close modal"></button>
		</div>
	{/if}
{/if}
