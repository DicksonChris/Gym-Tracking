<script>
    export let entry;
</script>

<li class="p-2 cursor-pointer hover:bg-primary">
  <p class="text-sm text-base-content">
      {entry.measurement.reps 
          ? `${entry.measurement.reps} reps` 
          : `Duration: ${entry.measurement.duration}`}
  </p>
</li>
<li class="p-2 cursor-pointer hover:bg-primary">
  <p class="text-sm text-base-content">
      {entry.measurement.reps 
          ? `${entry.measurement.weight} lbs` 
          : `Distance: ${entry.measurement.distance}`}
  </p>
</li>