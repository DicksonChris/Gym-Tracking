<!--
  The wrapping div applies the mask to whatever content is passed into the component.
  It fills its (positioned) parent, so the mask always covers the full area.
-->
<div class="mask-container absolute inset-0">
	<slot />
</div>

<style>
	.mask-container {
		/* Apply the galaxy mask image.
       Note: The mask uses the alpha channel of the image.
       "cover" keeps the spiral covering the whole area at any aspect ratio. */
		mask-image: url('/images/galaxy-mask.png');
		-webkit-mask-image: url('/images/galaxy-mask.png');
		mask-size: cover;
		-webkit-mask-size: cover;
		mask-repeat: no-repeat;
		-webkit-mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-position: center;
	}
</style>
