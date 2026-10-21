<script lang="ts">
	let { children } = $props();
</script>

<div class="p-2 pt-[calc(5rem+env(safe-area-inset-top))]">
	{@render children()}
</div>
