<script lang="ts">
	import type { History } from '$lib/api/history';
	export let history: History;
</script>

<a
	type="button"
	class="flex hover:bg-secondary hover:bg-opacity-20 border-[1px] border-base-100 hover:border-[1px] hover:border-secondary"
	href="/exercise/{history.exercise}/history/{history.id}"
>
	<li class="flex-1 cursor-pointer p-2">
		<p class="text-sm text-base-content">
			{history.reps ? `${history.reps} reps` : `${history.time} min`}
		</p>
	</li>
	<li class="flex-1 cursor-pointer p-2">
		<p class="text-sm text-base-content">
			{history.reps ? `${history.weight} lbs` : `${history.distance}`}
		</p>
	</li>
</a>
