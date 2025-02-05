<script lang="ts">
  import { onMount } from 'svelte';

  let transformStyle = "rotateX(0deg) rotateY(0deg)";
  let imageElement: HTMLImageElement;
  let prefersReducedMotion = false;

  onMount(() => {
    prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  function handleMouseMove(e: MouseEvent) {
    if (prefersReducedMotion) return;
    
    const rect = imageElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const maxAngle = 20;
    // Compute rotation angles based on cursor position
    const rotateY = (dx / (rect.width / 2)) * maxAngle;
    const rotateX = -(dy / (rect.height / 2)) * maxAngle;
    transformStyle = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleMouseLeave() {
    if (prefersReducedMotion) return;
    transformStyle = "rotateX(0deg) rotateY(0deg)";
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="tilt-container" on:mousemove={handleMouseMove} on:mouseleave={handleMouseLeave}>
  <img
    bind:this={imageElement}
    src="/images/GainsGalaxy.app.png"
    alt="logo"
    width="400px"
    class="tilting-image"
    style="transform: {transformStyle}"
  />
</div>

<style>
  .tilt-container {
    position: absolute;
    left: 50%;
    top: calc(55%);
    transform: translateX(-50%) translateY(-50%);
    perspective: 1000px;
    /* Ensure the container is sized for the image */
    max-width: 40vw;
  }

  .tilting-image {
    display: block;
    width: 100%;
    transition: transform 0.1s;
    /* A constant drop-shadow accentuates the tilt */
    filter: drop-shadow(0px 10px 15px rgba(0,0,0,0.5));
  }

  @media (prefers-reduced-motion: reduce) {
    .tilting-image {
      transition: none;
    }
  }
</style>