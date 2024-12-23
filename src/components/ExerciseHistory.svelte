<script>
    export let history = [];

    // Group history entries by date
    let groupedHistory = {};

    $: {
        groupedHistory = history.reduce((acc, entry) => {
            const date = new Date(entry.timestamp).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(entry);
            return acc;
        }, {});

        // Sort dates in ascending order
        groupedHistory = Object.keys(groupedHistory).sort((a, b) => new Date(a) - new Date(b))
            .reduce((acc, date) => {
                acc[date] = groupedHistory[date];
                return acc;
            }, {});
    }
</script>

<div class="overflow-x-auto">
    <div class="bg-base-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {#each Object.keys(groupedHistory) as date}
            <div class="card rounded-none">
                <h3 class="card-title text-center">{date}</h3>
                <ul class="grid grid-cols-2">
                    {#each groupedHistory[date] as entry}
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
                    {/each}
                </ul>
            </div>
        {/each}
    </div>
</div>
