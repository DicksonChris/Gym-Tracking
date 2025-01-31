<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	let email = '';
	let password = '';
	let passwordConfirm = '';
	let name = '';

	let errorMessage = data?.formError || '';
	let successMessage = data?.success || '';
</script>

<h1>Register</h1>

{#if errorMessage}
<div style="color: red">{errorMessage}</div>
{/if}

{#if successMessage}
<div style="color: green">{successMessage}</div>
{/if}

<form method="POST" use:enhance>
	<label>
		Name:
		<input type="text" name="name" bind:value={name} required />
	</label>
	<br />

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

	<label>
		Confirm Password:
		<input type="password" name="passwordConfirm" bind:value={passwordConfirm} required />
	</label>
	<br />

	<button type="submit">Register</button>
</form>
