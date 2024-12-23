<script>
    import EntryItem from './EntryItem.svelte'; // Import the new component

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
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {#each Object.keys(groupedHistory) as date}
            <div class="card rounded-none">
                <h3 class="card-title text-center">{date}</h3>
                <ul class="bg-base-300 space-y-2">
                    {#each groupedHistory[date] as entry}
                        <EntryItem {entry} />
                    {/each}
                </ul>
            </div>
        {/each}
    </div>
</div>
