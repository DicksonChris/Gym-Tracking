<script lang="ts">
	import { onMount } from 'svelte';

	// Props:
	// - burnColors: an array of three color strings for the chromatic aberration burn
	// - bg: the background fill (a canvas fillStyle color)
	export let burnColors: string[] = [
		'rgba(255, 200, 100, 0.8)',
		'rgba(255, 50, 50, 0.8)',
		'rgba(100, 100, 255, 0.8)'
	];
	export let bg = 'black';

	interface SwirlingStar {
		r: number;
		theta: number;
		speed: number;
		size: number;
		burnColor: string;
	}

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Variables for canvas center and maximum swirl radius
		let centerX = 0;
		let centerY = 0;
		let maxSwirlRadius = 0;

		// Create an offscreen canvas for the static star field background
		const bgCanvas = document.createElement('canvas');
		const bgCtx = bgCanvas.getContext('2d');
		if (!bgCtx) return;

		// Array for swirling stars
		const swirlingStars: SwirlingStar[] = [];
		const swirlingStarCount = 150; // Adjust the number of swirling stars as desired

		let rafId = 0;

		// Resize the canvas based on the container size. The background is
		// regenerated, but existing swirling stars are rescaled proportionally
		// so resizing feels smooth instead of re-scattering everything.
		function resizeCanvas() {
			const previousMax = maxSwirlRadius;
			canvas.width = container.clientWidth;
			canvas.height = container.clientHeight;
			centerX = canvas.width / 2;
			centerY = canvas.height / 2;
			// Set maxSwirlRadius so that stars can travel off the edge.
			maxSwirlRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 0.9;
			createBackground();
			if (swirlingStars.length === 0 || previousMax <= 0) {
				createSwirlingStars();
			} else {
				const scale = maxSwirlRadius / previousMax;
				for (const star of swirlingStars) {
					star.r *= scale;
					star.size *= scale;
				}
			}
		}
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		// Create the static star field background.
		// Each background star is drawn using a radial gradient that is white in the center and
		// fades to one of the provided burnColors at its edge.
		function createBackground() {
			if (!bgCtx) return;
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
		function drawStar(
			starCtx: CanvasRenderingContext2D,
			x: number,
			y: number,
			spikes: number,
			outerRadius: number,
			innerRadius: number
		) {
			let rot = (Math.PI / 2) * 3; // Start at -90° (pointing up)
			const step = Math.PI / spikes; // For 4 spikes, each step is 45°
			starCtx.beginPath();
			starCtx.moveTo(x, y - outerRadius);
			for (let i = 0; i < spikes; i++) {
				const x1 = x + Math.cos(rot) * outerRadius;
				const y1 = y + Math.sin(rot) * outerRadius;
				starCtx.lineTo(x1, y1);
				rot += step;
				const x2 = x + Math.cos(rot) * innerRadius;
				const y2 = y + Math.sin(rot) * innerRadius;
				starCtx.lineTo(x2, y2);
				rot += step;
			}
			starCtx.lineTo(x, y - outerRadius);
			starCtx.closePath();
			starCtx.fill();
		}

		// Animation loop: update positions and redraw the canvas.
		function animate() {
			if (!ctx) return;
			rafId = requestAnimationFrame(animate);
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

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			cancelAnimationFrame(rafId);
		};
	});
</script>

<!--
  The hero container fills its parent.
  The canvas fills the container as a background,
  and the <slot> renders any child content above it.
-->
<div class="h-full w-full" bind:this={container}>
	<canvas class="block h-full w-full" bind:this={canvas}></canvas>
	<div>
		<slot></slot>
	</div>
</div>