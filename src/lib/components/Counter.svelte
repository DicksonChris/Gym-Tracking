<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import Icon from '@iconify/svelte';

    export let value: number = 0;
    export let step: number = 1;
    export let min: number = 0;
    export let max: number = Infinity;
    export let decimal: boolean = false;

    const dispatch = createEventDispatcher();
    let displayValue: string = decimal ? value.toFixed(1) : value.toString();

    // Reactive statement to keep displayValue in sync with value
    $: displayValue = decimal ? value.toFixed(1) : value.toString();

    onMount(() => {
        // Initialize displayValue based on initial value
        displayValue = decimal ? value.toFixed(1) : value.toString();
        dispatch('update', value);
    });

    function decrement() {
        if (value - step >= min) {
            value = parseFloat((value - step).toFixed(decimal ? 1 : 0));
            displayValue = decimal ? value.toFixed(1) : value.toString();
            dispatch('update', value);
        }
    }

    function increment() {
        if (value + step <= max) {
            value = parseFloat((value + step).toFixed(decimal ? 1 : 0));
            displayValue = decimal ? value.toFixed(1) : value.toString();
            dispatch('update', value);
        }
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        displayValue = target.value;

        // Optionally, you can add real-time validation or formatting here
    }

    function formatValue() {
        const parsedValue = parseFloat(displayValue);
        if (isNaN(parsedValue)) {
            value = min !== -Infinity ? min : 0;
        } else {
            value = Math.max(min, Math.min(max, parsedValue));
            value = decimal ? parseFloat(value.toFixed(1)) : Math.round(value);
        }
        displayValue = decimal ? value.toFixed(1) : value.toString();
        dispatch('update', value);
    }
</script>

<div class="grid grid-cols-3">
    <div class="spacer"></div>
    <div class="flex flex-row items-center justify-center">
        <button
            type="button"
            on:click={decrement}
            class="btn bg-base-300 btn-lg w-20 rounded-l-3xl rounded-r-none"
            aria-label="Decrement"
        >
            <Icon icon="fa-solid:minus" />
        </button>
        <div class="flex flex-col bg-neutral">
            <input
                type="number"
                bind:value={displayValue}
                on:input={handleInput}
                on:blur={formatValue}
                class="w-40 input input-lg input-primary border-none bg-neutral text-center text-4xl text-neutral-content focus:outline-none"
                aria-label="Counter input"
                step={decimal ? "0.1" : "1"}
                min={min}
                max={max}
            />
        </div>
        <button
            type="button"
            on:click={increment}
            class="btn bg-base-300 btn-lg w-20 rounded-l-none rounded-r-3xl"
            aria-label="Increment"
        >
            <Icon icon="fa-solid:plus" />
        </button>
    </div>
</div>

<style>
    /* Hide the spinners for input[type="number"] */
    /* Chrome, Safari, Edge, Opera */
    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type='number'] {
        appearance: textfield;
        -moz-appearance: textfield;
    }
</style>
