<script>
    export let entry;
</script>

<li class="bg-base-200 p-2 rounded">
    <p class="text-sm text-base-content">
        {entry.measurement.reps 
            ? `${entry.measurement.reps} reps x ${entry.measurement.weight} lbs` 
            : `Duration: ${entry.measurement.duration}, Distance: ${entry.measurement.distance}`}
    </p>
</li>