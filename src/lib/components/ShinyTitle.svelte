<script>
	let { children } = $props();
</script>

<!-- Outer pill -->
<div
	class="inline-block rounded-[20px]
         bg-gradient-to-b from-[#cda197] to-[#f3e5b4]
         p-1 w-full"
>
	<!-- Middle pill -->
	<div
		class="rounded-2xl
           border-y-[0.5px] border-[#e66602] bg-gradient-to-b from-[#5a8f99]
           via-[#5ac8d3]
           to-[#5a8f99] p-[0.1rem]"
	>
		<!-- Inner pill -->
		<div
			class="flex whitespace-nowrap
             items-center
             rounded-2xl
             border-[0.5px]
             border-[#36e7ff]
             bg-gradient-to-b
             from-[#97efff]
             to-[#5ac8d3] px-2 py-1
             text-[2rem]
             font-bold text-[#1b1b1b] [text-shadow:0_-2px_8px_rgb(180,220,250)]"
		>
			{@render children()}
		</div>
	</div>
</div>
