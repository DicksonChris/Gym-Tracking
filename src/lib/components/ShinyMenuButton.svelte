<script>
	export let size = "lg"
</script>

<div class="flex h-full flex-col items-center 
           hover:brightness-95">
	<div
		class="rounded-full border-2
         border-[#aa3333] bg-gradient-to-b from-[#fcb000]
         via-[#ec1e1a] to-[#ff23bd]
         p-1
         shadow-md shadow-[#0059dd]
         flex h-16 flex-col items-center justify-between"
	>
		<div
			class="w-1 rounded-full
         bg-gradient-to-b from-[#ffffff] to-[#ffbdbd] p-1"
		></div>
		<div
			class="inline-block
             cursor-pointer
             whitespace-nowrap
             rounded-full
             border-2 border-[#287eb8]
             bg-gradient-to-b
             from-[#00e9fa]
             to-[#0274df] p-[8px]
             font-bold text-[#1b1b1b] [text-shadow:0_-2px_8px_rgb(255,230,0)]
             active:translate-y-[0.2px]
             active:brightness-100
             active:[box-shadow:inset_0_0_10px_#df8202ff]"
		></div>
		<div
			class="w-1 rounded-full
              bg-gradient-to-b from-[#ffffff] to-[#ffbdbd] p-1"
		></div>
	</div>
</div>
