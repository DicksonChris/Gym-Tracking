<script lang="ts">	
	import { goto } from '$app/navigation';
	export let exerciseID: string;

	function handleClick() {
		goto(`/exercise/${exerciseID}`);
	}
</script>

<button class="btn btn-square btn-ghost text-secondary hover:bg-white hover:bg-opacity-20 btn-sm" on:click={handleClick} aria-label="Add set">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 6v6m0 0v6m0-6h6m-6 0H6"
		/>
	</svg>
</button>
