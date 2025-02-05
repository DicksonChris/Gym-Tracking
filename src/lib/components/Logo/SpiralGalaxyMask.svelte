<script>
  // Optional props to control the width and height of the masked container.
  export let width = "100%";
  export let height = "100%";
</script>

<!--
  The wrapping div applies the mask to whatever content is passed into the component.
  You can use this component as a wrapper for an <img> or any other element.
-->
<div class="mask-container" style="width: {width}; height: {height};">
  <slot />
</div>

<style>
  .mask-container {
    /* Apply the galaxy mask image.
       Note: The mask uses the alpha channel of the image.
       Adjust mask-size (cover, contain, etc.) as needed for your design. */
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
