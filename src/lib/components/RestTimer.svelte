<script lang="ts">
	import { onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import {
		restTimer,
		clearRestTimer,
		extendRestTimer,
		adjustExerciseRest
	} from '$lib/stores/restTimer';
	import { fmtDuration, REST_MAX, REST_MIN, REST_STEP } from '$lib/rest';

	let now = Date.now();
	let finished = false;
	let showSettings = false;

	$: if (!$restTimer) showSettings = false;

	const tick = setInterval(() => {
		now = Date.now();
	}, 250);
	onDestroy(() => clearInterval(tick));

	$: remaining = $restTimer ? Math.max(0, Math.ceil(($restTimer.endsAt - now) / 1000)) : 0;

	// fire the alert exactly once when the countdown hits zero
	$: if ($restTimer && remaining === 0 && !finished) {
		finished = true;
		alertDone();
	}
	$: if (!$restTimer || remaining > 0) {
		finished = $restTimer ? false : finished;
	}

	function alertDone() {
		try {
			navigator.vibrate?.([200, 100, 200, 100, 400]);
		} catch {
			/* unsupported */
		}
		try {
			const ctx = new AudioContext();
			const beep = (at: number, freq: number) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.frequency.value = freq;
				gain.gain.setValueAtTime(0.25, ctx.currentTime + at);
				gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + 0.3);
				osc.connect(gain).connect(ctx.destination);
				osc.start(ctx.currentTime + at);
				osc.stop(ctx.currentTime + at + 0.35);
			};
			beep(0, 880);
			beep(0.45, 880);
			beep(0.9, 1175);
			setTimeout(() => ctx.close(), 2000);
		} catch {
			/* unsupported */
		}
		// auto-dismiss shortly after ringing
		setTimeout(() => {
			clearRestTimer();
		}, 4000);
	}

</script>

{#if $restTimer}
	<div
		class="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-1/2 z-[60] -translate-x-1/2"
	>
		{#if showSettings && remaining > 0}
			<div
				class="mb-2 flex items-center justify-center gap-1 rounded-full border border-base-300 bg-base-100 p-1 shadow-lg shadow-black/40"
			>
				<button
					class="btn btn-ghost btn-xs"
					disabled={$restTimer.restSeconds <= REST_MIN}
					on:click={() => adjustExerciseRest(-REST_STEP)}
				>
					−15s
				</button>
				<span class="px-1 text-xs text-base-content">
					Rest <span class="font-mono font-bold">{fmtDuration($restTimer.restSeconds)}</span>
				</span>
				<button
					class="btn btn-ghost btn-xs"
					disabled={$restTimer.restSeconds >= REST_MAX}
					on:click={() => adjustExerciseRest(REST_STEP)}
				>
					+15s
				</button>
			</div>
		{/if}
		<div
			class="flex items-center gap-2 rounded-full border border-primary bg-base-100 py-2 pl-4 pr-2 shadow-lg shadow-black/40 {remaining === 0
				? 'animate-pulse border-success'
				: ''}"
		>
			<Icon icon="mdi:timer-outline" class="h-5 w-5 {remaining === 0 ? 'text-success' : 'text-primary'}" />
			<span class="min-w-[3.5rem] font-mono text-xl font-bold text-base-content">
				{remaining === 0 ? 'GO!' : fmtDuration(remaining)}
			</span>
			{#if remaining > 0}
				<button class="btn btn-ghost btn-xs" on:click={() => extendRestTimer(30)}>+30s</button>
				{#if $restTimer.exerciseId}
					<button
						class="btn btn-ghost btn-xs {showSettings ? 'text-primary' : ''}"
						aria-label="Rest settings for this exercise"
						aria-expanded={showSettings}
						on:click={() => (showSettings = !showSettings)}
					>
						<Icon icon="mdi:cog" class="h-4 w-4" />
					</button>
				{/if}
			{/if}
			<button class="btn btn-ghost btn-xs" aria-label="Dismiss timer" on:click={clearRestTimer}>
				<Icon icon="mdi:close" class="h-4 w-4" />
			</button>
		</div>
	</div>
{/if}
