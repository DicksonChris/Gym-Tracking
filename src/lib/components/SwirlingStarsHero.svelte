<script>
	import { onMount, onDestroy } from 'svelte';

	// Props:
	// - height: the hero banner height (default: full viewport height)
	// - burnColors: an array of three color strings for the chromatic aberration burn
	// - bg: the background fill (can be a color or CSS gradient)
	export let height = '100vh';
	export let burnColors = [
		'rgba(255, 200, 100, 0.8)',
		'rgba(255, 50, 50, 0.8)',
		'rgba(100, 100, 255, 0.8)'
	];
	export let bg = 'black';

	let container;
	let canvas;

	onMount(() => {
		const ctx = canvas.getContext('2d');

		// Variables for canvas center and maximum swirl radius
		let centerX, centerY, maxSwirlRadius;

		// Create an offscreen canvas for the static star field background
		const bgCanvas = document.createElement('canvas');
		const bgCtx = bgCanvas.getContext('2d');

		// Array for swirling stars
		const swirlingStars = [];
		const swirlingStarCount = 200; // Adjust the number of swirling stars as desired

		// Resize the canvas based on the container size, then update the center and regenerate the background and stars.
		function resizeCanvas() {
			canvas.width = container.clientWidth;
			canvas.height = container.clientHeight;
			centerX = canvas.width / 2;
			centerY = canvas.height / 2;
			// Set maxSwirlRadius so that stars can travel off the edge.
			maxSwirlRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 0.9;
			createBackground();
			createSwirlingStars();
		}
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		// Create the static star field background.
		// Each background star is drawn using a radial gradient that is white in the center and
		// fades to one of the provided burnColors at its edge.
		function createBackground() {
			bgCanvas.width = canvas.width;
			bgCanvas.height = canvas.height;
			bgCtx.fillStyle = bg; // use the passed background value
			bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
			const starCount = 500;
			for (let i = 0; i < starCount; i++) {
				const x = Math.random() * bgCanvas.width;
				const y = Math.random() * bgCanvas.height;
				const radius = Math.random() * 1.5 + 0.5;
				// Pick one of the passed burn colors at random.
				const chosenBurnColor = burnColors[Math.floor(Math.random() * burnColors.length)];
				const gradient = bgCtx.createRadialGradient(x, y, 0, x, y, radius);
				gradient.addColorStop(0, 'white');
				gradient.addColorStop(1, chosenBurnColor);
				bgCtx.beginPath();
				bgCtx.arc(x, y, radius, 0, Math.PI * 2);
				bgCtx.fillStyle = gradient;
				bgCtx.fill();
			}
		}

		// Create swirling stars with a uniform distribution across the available area.
		// Stars closer to the center rotate faster.
		function createSwirlingStars() {
			swirlingStars.length = 0;
			for (let i = 0; i < swirlingStarCount; i++) {
				const r = Math.sqrt(Math.random()) * maxSwirlRadius;
				const theta = Math.random() * Math.PI * 2;
				const baseSpeed = 0.01;
				const speed = baseSpeed * ((maxSwirlRadius - r) / maxSwirlRadius + 0.2);
				const starSize = 3 + ((maxSwirlRadius - r) / maxSwirlRadius) * (15 * Math.random());
				const chosenBurnColor = burnColors[Math.floor(Math.random() * burnColors.length)];
				swirlingStars.push({ r, theta, speed, size: starSize, burnColor: chosenBurnColor });
			}
		}

		// Draw a four-pointed star whose points always face the cardinal directions.
		function drawStar(ctx, x, y, spikes, outerRadius, innerRadius) {
			let rot = (Math.PI / 2) * 3; // Start at -90° (pointing up)
			const step = Math.PI / spikes; // For 4 spikes, each step is 45°
			ctx.beginPath();
			ctx.moveTo(x, y - outerRadius);
			for (let i = 0; i < spikes; i++) {
				const x1 = x + Math.cos(rot) * outerRadius;
				const y1 = y + Math.sin(rot) * outerRadius;
				ctx.lineTo(x1, y1);
				rot += step;
				const x2 = x + Math.cos(rot) * innerRadius;
				const y2 = y + Math.sin(rot) * innerRadius;
				ctx.lineTo(x2, y2);
				rot += step;
			}
			ctx.lineTo(x, y - outerRadius);
			ctx.closePath();
			ctx.fill();
		}

		// Animation loop: update positions and redraw the canvas.
		function animate() {
			requestAnimationFrame(animate);
			ctx.drawImage(bgCanvas, 0, 0);
			swirlingStars.forEach((star) => {
				star.theta += star.speed;
				const x = centerX + star.r * Math.cos(star.theta);
				const y = centerY + star.r * Math.sin(star.theta);
				ctx.save();
				ctx.translate(x, y);
				// Create a radial gradient for each swirling star.
				const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, star.size);
				gradient.addColorStop(0, 'white');
				gradient.addColorStop(1, star.burnColor);
				ctx.fillStyle = gradient;
				drawStar(ctx, 0, 0, 4, star.size, star.size / 5);
				ctx.restore();
			});
		}
		animate();

		onDestroy(() => {
			window.removeEventListener('resize', resizeCanvas);
		});
	});
</script>

<!--
  The hero container is relatively positioned.
  The canvas fills the container as a background,
  and the <slot> renders any child content above it.
-->
<div class="hero" bind:this={container} style="height: {height}">
	<canvas bind:this={canvas}></canvas>
	<div class="content">
		<slot></slot>
	</div>
</div>

<style>
	.hero {
		position: relative;
		overflow: hidden;
	}
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.content {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		color: white;
		text-align: center;
		padding: 1rem;
	}
</style>
