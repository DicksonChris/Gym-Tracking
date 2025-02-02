<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';
	import type { Workout } from '$lib/api/workouts';

	/** An array of all workouts to filter and display. */
	export let workouts: Workout[] = [];

	/** The currently selected workout IDs. */
	export let selectedWorkouts: string[] = [];

	const dispatch = createEventDispatcher();

	let query = '';
	let showList = false;
	let container: HTMLDivElement;
	let textInput: HTMLInputElement;

	/**
	 * Toggle a single workout ID in the selectedWorkouts array,
	 * then dispatch the updated array.
	 */
	function toggleWorkout(id: string) {
		if (selectedWorkouts.includes(id)) {
			selectedWorkouts = selectedWorkouts.filter((sel) => sel !== id);
		} else {
			selectedWorkouts = [...selectedWorkouts, id];
		}
		dispatch('selectionChange', selectedWorkouts);
	}

	/**
	 * Clear all selections at once.
	 */
	function clearSelections() {
		selectedWorkouts = [];
		dispatch('selectionChange', selectedWorkouts);
	}

	function toggleDropdown() {
		showList = !showList;
		if (showList) {
			textInput?.focus();
		}
	}

	/**
	 * Filter the workouts based on the input `query`.
	 */
	$: filteredWorkouts = workouts
		.filter((w) => w.groupName.toLowerCase().includes(query.toLowerCase()))
		.sort((a, b) => a.groupName.localeCompare(b.groupName));

	/**
	 * Hide the dropdown if user clicks outside container.
	 */
	function handleClickOutside(e: MouseEvent) {
		if (container && !container.contains(e.target as Node)) {
			showList = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative" bind:this={container}>
	<input
		type="text"
		class="input input-bordered w-full rounded-none pr-10 text-base-content"
		placeholder="Select workouts..."
		bind:value={query}
		bind:this={textInput}
		on:focus={() => (showList = true)}
		on:keydown={(e) => e.key === 'Escape' && (showList = false)}
	/>
	<button
		type="button"
		class="absolute right-2 top-1/2 -translate-y-1/2 transform"
		on:click={(e) => {
			e.stopPropagation();
			toggleDropdown();
		}}
		aria-label="Toggle dropdown"
		aria-expanded={showList}
	>
		{#if showList}
			<Icon icon="heroicons:chevron-up-20-solid" class="h-5 w-5" />
		{:else}
			<Icon icon="heroicons:chevron-down-20-solid" class="h-5 w-5" />
		{/if}
	</button>

	{#if showList && filteredWorkouts.length > 0}
		<ul
			class="absolute z-20 max-h-60 w-full overflow-auto rounded bg-base-100 text-base-content shadow-lg"
		>
			{#if selectedWorkouts.length > 0}
				<li class="absolute right-0 flex justify-end px-4 py-2">
					<button
						class="link-hover text-sm"
						on:click={(e) => {
							e.stopPropagation();
							clearSelections();
						}}
						aria-label="Clear all selections"
					>
						Clear All
					</button>
				</li>
			{/if}

			{#each filteredWorkouts as workout}
				<!-- Each workout is displayed as a button row -->
				<button
					class="w-full text-start flex cursor-pointer items-center px-4 py-2 hover:bg-base-200"
					on:click={(e) => {
						e.stopPropagation();
						toggleWorkout(workout.id);
					}}
				>
					<div class="relative mr-2">
						<input
							type="checkbox"
							class="custom-checkbox checkbox-primary checkbox bg-transparent"
							checked={selectedWorkouts.includes(workout.id)}
							readonly
						/>
						{#if selectedWorkouts.includes(workout.id)}
							<span class="checkbox-number">
								{selectedWorkouts.indexOf(workout.id) + 1}
							</span>
						{/if}
					</div>
					<span class="flex-1">{workout.groupName}</span>
				</button>
			{/each}
		</ul>
	{/if}
</div>

<!-- Show badges for each selected workout below the dropdown -->
{#if selectedWorkouts.length}
	<div class="my-3 flex flex-wrap gap-2">
		{#each selectedWorkouts as sw}
			<button
				class="mx-1 focus:outline-none"
				on:click={() => toggleWorkout(sw)}
				aria-label="Remove selection"
			>
				<span class="badge badge-primary flex items-center">
					{workouts.find((w) => w.id === sw)?.groupName}
				</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	/* Adjust the checkbox to accommodate the number */
	.custom-checkbox {
		position: relative;
	}

	/* Hide the default checkmark */
	.custom-checkbox:checked {
		background-image: none;
	}

	/* Style for the number inside the checkbox */
	.checkbox-number {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -49%);
		font-size: 1.2rem; /* Increased font size from 0.75rem to 1rem */
		font-weight: bold;
		color: black; /* Changed from white to black */
		pointer-events: none;
		animation: numberAppear 0.2s ease-out;
	}

	/* Optional Styling for the selection order number */
	.absolute {
		position: absolute;
	}
	.text-sm {
		font-size: 0.875rem; /* Tailwind CSS text-sm */
	}

	/* Ensure the checkbox has no default checkmark and centers the number */
	.checkbox-primary:checked {
		background-repeat: no-repeat;
		animation: none; /* Remove checkmark animation */
		background-color: var(--chkbg);
		background-image: none; /* Remove the checkmark */
	}

	/* Animation for the number appearing */
	@keyframes numberAppear {
		from {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}

	/* Optional: Adjust the checkbox size if necessary */
	.checkbox-primary {
		height: 1.5rem; /* 24px */
		width: 1.5rem; /* 24px */
	}

	/* Optional: Prevent text selection on the checkbox and number */
	.checkbox-primary,
	.checkbox-number {
		user-select: none;
	}
</style>
