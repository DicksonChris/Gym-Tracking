<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import { workoutsStore } from '$lib/stores/workoutsStore';

	export let selectedWorkouts: string[] = [];

	const dispatch = createEventDispatcher();
	let workouts = [];
	$: workouts = $workoutsStore ?? [];

	let query = '';
	let showList = false;
	let container: HTMLDivElement;
	let textInput: HTMLInputElement;

	function toggleWorkout(id: string) {
		if (selectedWorkouts.includes(id)) {
			selectedWorkouts = selectedWorkouts.filter((sel) => sel !== id);
		} else {
			selectedWorkouts = [...selectedWorkouts, id];
		}
		dispatch('selectionChange', selectedWorkouts);
	}

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

	$: filteredWorkouts = workouts
		.filter((w) => w.groupName.toLowerCase().includes(query.toLowerCase()))
		.sort((a, b) => a.groupName.localeCompare(b.groupName));

	function handleClickOutside(e: MouseEvent) {
		if (container && !container.contains(e.target as Node)) {
			showList = false;
		}
	}

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

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
		class="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform"
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
      <li
      class="flex cursor-pointer items-center px-4 py-2 hover:bg-base-200"
      on:click={(e) => {
        e.stopPropagation();
        toggleWorkout(workout.id);
      }}
    >
					<div class="relative mr-2">
						<input
							type="checkbox"
							class="custom-checkbox checkbox-accent checkbox bg-transparent"
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
				</li>
			{/each}
		</ul>
	{/if}
</div>

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
	.inset-0 {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.text-gray-500 {
		color: #6b7280; /* Tailwind CSS gray-500 */
	}
	.ml-2 {
		margin-left: 0.5rem; /* Tailwind CSS ml-2 */
	}
	.text-sm {
		font-size: 0.875rem; /* Tailwind CSS text-sm */
	}

	/* Ensure the checkbox has no default checkmark and centers the number */
	.checkbox-accent:checked,
	.checkbox-accent[aria-checked='true'] {
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
	.checkbox-accent {
		height: 1.5rem; /* 24px */
		width: 1.5rem; /* 24px */
	}

	/* Optional: Prevent text selection on the checkbox and number */
	.checkbox-accent,
	.checkbox-number {
		user-select: none;
	}
</style>
