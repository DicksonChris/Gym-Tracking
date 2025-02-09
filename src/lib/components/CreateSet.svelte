<script lang="ts">	
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	export let exerciseID: string;

	function handleClick() {
		goto(`/home/exercise/${exerciseID}`);
	}
</script>

<button on:click={handleClick} aria-label="Add set">
	<Icon icon="material-symbols:add" class="h-6 w-6" />
</button>
