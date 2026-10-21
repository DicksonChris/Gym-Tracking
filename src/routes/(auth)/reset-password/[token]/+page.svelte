<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	$: errorMessage = $page.form?.formError ?? '';

	let password = '';
	let passwordConfirm = '';
</script>

<div class="flex items-center justify-center p-4">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title mb-4 justify-center">Choose a New Password</h2>

			<form method="POST" use:enhance class="space-y-4">
				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text text-lg">New password</span>
					</label>
					<input
						id="password"
						type="password"
						name="password"
						bind:value={password}
						required
						minlength="8"
						class="input input-bordered text-base-content"
					/>
				</div>

				<div class="form-control">
					<label class="label" for="passwordConfirm">
						<span class="label-text text-lg">Confirm new password</span>
					</label>
					<input
						id="passwordConfirm"
						type="password"
						name="passwordConfirm"
						bind:value={passwordConfirm}
						required
						minlength="8"
						class="input input-bordered text-base-content"
					/>
				</div>

				{#if errorMessage}
					<div class="alert bg-inherit p-0 text-error">
						<div class="flex items-center gap-2">
							<Icon icon="mdi:close-circle" class="h-6 w-6 flex-shrink-0 text-current" />
							<span>{errorMessage}</span>
						</div>
					</div>
				{/if}

				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">Set new password</button>
				</div>
			</form>

			<div class="mt-4 text-center text-secondary">
				<a href="/forgot-password" class="link link-secondary">Request a new link</a>
			</div>
		</div>
	</div>
</div>
