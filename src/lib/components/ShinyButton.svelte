<script>
	export let label = 'REP. 30';
</script>

<!-- Outer pill (solid #fcb000) -->
<div class="outer-pill shadow-md shadow-[#a88f548c]">
	<!-- Middle pill (bevel gradient) -->
	<div class="middle-pill">
		<!-- Inner pill (button face, yellow/orange gradient) -->
		<button class="inner-pill">
			{label}
		</button>
	</div>
</div>

<style>
	/* 1) Outer pill: solid #fcb000 */
	.outer-pill {
		display: inline-block;
		border-radius: 9999px; /* Pill shape */
		background-color: #fcb000;
		background: linear-gradient(to bottom, #fcb000, #b02220);
		padding: 0.15rem; /* Space for the ring thickness */
	}

	/* 2) Middle pill: #fafdb6 → #efab8e gradient */
	.middle-pill {
		border-radius: 9999px;
		background: linear-gradient(to bottom, #fcfcc2, #eda418, #efab8e);
		padding: 0.25rem;
		border: #e66602 0.5px solid; /* Reveal the gradient around the innermost button */
	}

	/* 3) Inner pill: #ffd62f → #ffc107 gradient */
	.inner-pill {
    position: relative;
		border: none;
		border-radius: 9999px;
		cursor: pointer;

		/* Adjust for your preferred button size */
		padding: 0 1rem;

		/* Text styling */
		font-size: 2rem;
		font-weight: bold;
		color: #1b1b1b;
		border: #d4b817 0.5px solid;

		text-shadow: 0 -2px 8px rgb(255, 230, 0);
		/* Yellow to orange gradient for the “face” */
		background: linear-gradient(to bottom, #fae200, #df8202);
	}

	.middle-pill:hover {
		filter: brightness(0.95);
	}

	.middle-pill:active {
		filter: brightness(1);
		transform: translateY(0.2px);
		box-shadow: inset 0 0 10px #ccccccff;
	}

	.inner-pill:active {
		filter: brightness(1);
		transform: translateY(0.2px);
		box-shadow: inset 0 0 10px #df8202ff;
	}
</style>
