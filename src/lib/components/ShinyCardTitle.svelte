<script>
	export let className = '';
</script>

<div
	class="{className} [text-shadow:0_-2px_8px_rgb(96, 184, 200)] flex flex-row
             items-center
             justify-between
             whitespace-nowrap
             rounded-t-2xl
             border-[0.5px]
             border-[#59c2d1] bg-gradient-to-b from-[#5fb7c7]
             to-[#328bc0]
             px-4 py-6 text-[2rem] font-bold text-[#1b1b1b]
             shadow-md
           shadow-[#a87d54cb]"
>
	<slot />
</div>
