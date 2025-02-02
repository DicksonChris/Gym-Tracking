<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	// We'll track the error from $page.form
	$: errorMessage = $page.form?.formError ?? '';

	let email = '';
	let password = '';
</script>

<div class="flex items-center justify-center p-4">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title mb-4 justify-center">Login</h2>

			<form method="POST" use:enhance class="space-y-4">
				<!-- Email Field -->
				<div class="form-control">
					<label class="label" for="email">
						<span class="label-text text-lg">Email</span>
					</label>
					<input
						id="email"
						type="email"
						name="email"
						bind:value={email}
						required
						class="input input-bordered text-base-content"
					/>
				</div>

				<!-- Password Field -->
				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text text-lg">Password</span>
					</label>
					<input
						id="password"
						type="password"
						name="password"
						bind:value={password}
						required
						class="input input-bordered text-base-content"
					/>
				</div>

				{#if errorMessage}
					<div class="alert text-error bg-inherit p-0">
						<div class="flex items-center gap-2">
							<Icon icon="mdi:close-circle" class="h-6 w-6 flex-shrink-0 text-current" />
							<span>{errorMessage}</span>
						</div>
					</div>
				{:else }
				<div class="p-0">
					<div class="flex items-center gap-2">
						<span class="block h-6">&nbsp</span>
					</div>
				</div>
					
				{/if}

				<!-- Submit Button -->
				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">Login</button>
				</div>
			</form>

			<!-- Register link -->
			<div class="mt-4 text-center text-secondary">
				<span>Don't have an account?</span>
				<a href="/register" class="link link-secondary ml-1">Register</a>
			</div>
		</div>
	</div>
</div>
