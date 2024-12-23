<script>
	export let entry;
</script>

<div class="flex">
	<li class="flex-1 cursor-pointer p-2 hover:bg-primary">
		<p class="text-sm text-base-content">
			{entry.measurement.reps
				? `${entry.measurement.reps} reps`
				: `Duration: ${entry.measurement.duration}`}
		</p>
	</li>
	<li class="flex-1 cursor-pointer p-2 hover:bg-primary">
		<p class="text-sm text-base-content">
			{entry.measurement.reps
				? `${entry.measurement.weight} lbs`
				: `Distance: ${entry.measurement.distance}`}
		</p>
	</li>
</div>
