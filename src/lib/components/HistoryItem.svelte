<script lang="ts">
	import type { History } from '$lib/api/history';
	export let history: History;
</script>

<div class="flex hover:bg-base-content hover:bg-opacity-10" data-id={history.id}>
	<li class="flex-1 cursor-pointer p-2 hover:bg-primary">
		<p class="text-sm text-base-content">
			{history.reps
				? `${history.reps} reps`
				: `${history.duration} min`}
		</p>
	</li>
	<li class="flex-1 cursor-pointer p-2 hover:bg-primary">
		<p class="text-sm text-base-content">
			{history.reps
				? `${history.weight} lbs`
				: `${history.distance}`}
		</p>
	</li>
</div>