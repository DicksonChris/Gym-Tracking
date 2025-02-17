<script>
	export let size = 'lg';
</script>

{#if size === 'lg'}
	<!-- Outer pill -->
	<div
		class="inline-block
         rounded-full
         bg-gradient-to-b from-[#fcb000] to-[#b02220]
         p-1
         shadow-md shadow-[#a88f548c]"
	>
		<!-- Middle pill -->
		<div
			class="cursor-pointer
          rounded-full
           border-[0.5px] border-[#e66602] bg-gradient-to-b from-[#fcfcc2]
           via-[#eda418]
           to-[#efab8e] p-[0.35rem]
           hover:brightness-95
           active:translate-y-[0.2px]
           active:brightness-100
           active:[box-shadow:inset_0_0_10px_#ccccccff]"
		>
			<!-- Inner pill (button face) -->
			<button
				class="flex
             cursor-pointer
             whitespace-nowrap
             rounded-full
             border-[0.5px]
             border-[#d4b817]
             bg-gradient-to-b
             from-[#fae200]
             to-[#df8202] px-2
             text-[2rem]
             font-bold text-[#1b1b1b] [text-shadow:0_-2px_8px_rgb(255,230,0)]
             active:translate-y-[0.2px]
             active:brightness-100
             active:[box-shadow:inset_0_0_10px_#df8202ff]"
			>
				<slot />
			</button>
		</div>
	</div>
{:else}
	<!-- Outer pill -->
	<div
		class="inline-block
         h-full
         rounded-full
         bg-gradient-to-b from-[#fcb000] to-[#b02220]
         p-[0.1rem]
         shadow-md shadow-[#a88f548c]"
	>
		<!-- Middle pill -->
		<div
			class="cursor-pointer
          rounded-full
           border-[0.5px] border-[#e66602] bg-gradient-to-b from-[#fcfcc2]
           via-[#eda418]
           to-[#efab8e] p-[0.1rem]
           hover:brightness-95
           active:translate-y-[0.2px]
           active:brightness-100
           active:[box-shadow:inset_0_0_10px_#ccccccff]"
		>
			<!-- Inner pill (button face) -->
			<button
				class="flex
             cursor-pointer
             whitespace-nowrap
             rounded-full
             border-[0.5px]
             border-[#d4b817]
             bg-gradient-to-b
             from-[#fae200]
             to-[#df8202] px-[2px]
             font-bold text-[#1b1b1b] [text-shadow:0_-2px_8px_rgb(255,230,0)]
             active:translate-y-[0.2px]
             active:brightness-100
             active:[box-shadow:inset_0_0_10px_#df8202ff]"
			>
				<slot />
			</button>
		</div>
	</div>
{/if}
