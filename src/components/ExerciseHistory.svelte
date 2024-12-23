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
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {#each Object.keys(groupedHistory) as date}
            <div class="bg-white p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-2 text-center">{date}</h3>
                <ul class="space-y-2">
                    {#each groupedHistory[date] as entry}
                        <li class="bg-gray-100 p-2 rounded">
                            <p class="text-sm text-gray-700">
                                {entry.measurement.reps 
                                    ? `${entry.measurement.reps} reps x ${entry.measurement.weight} lbs` 
                                    : `Duration: ${entry.measurement.duration}, Distance: ${entry.measurement.distance}`}
                            </p>
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}
    </div>
</div>
