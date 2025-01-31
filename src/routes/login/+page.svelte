<script>
	let { data } = $props();

	let email = '';
	let password = '';

	// We'll display an error if the action returns one
	let errorMessage = data?.formError || '';
</script>

<h1>Login</h1>

{#if errorMessage}
<div style="color: red">{errorMessage}</div>
{/if}

<form method="POST" use:enhance>
	<label>
		Email:
		<input type="email" name="email" bind:value={email} required />
	</label>
	<br />

	<label>
		Password:
		<input type="password" name="password" bind:value={password} required />
	</label>
	<br />

	<button type="submit">Login</button>
</form>
