<script lang="ts">
	let { children } = $props();
</script>

<div class="p-2 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))]">
	{@render children()}
</div>
