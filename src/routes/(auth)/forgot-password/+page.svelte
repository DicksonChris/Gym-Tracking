<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	$: errorMessage = $page.form?.formError ?? '';
	$: success = $page.form?.success ?? false;

	let email = '';
</script>

<div class="flex items-center justify-center p-4">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title mb-4 justify-center">Reset Password</h2>

			{#if success}
				<div class="alert alert-success">
					<Icon icon="mdi:email-check" class="h-6 w-6 flex-shrink-0" />
					<span>
						If an account exists for that email, a password reset link is on its way. Check your
						inbox (and spam folder).
					</span>
				</div>
				<div class="mt-4 text-center text-secondary">
					<a href="/login" class="link link-secondary">Back to login</a>
				</div>
			{:else}
				<p class="mb-2 text-sm opacity-80">
					Enter your account email and we'll send you a link to reset your password.
				</p>

				<form method="POST" use:enhance class="space-y-4">
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

					{#if errorMessage}
						<div class="alert bg-inherit p-0 text-error">
							<div class="flex items-center gap-2">
								<Icon icon="mdi:close-circle" class="h-6 w-6 flex-shrink-0 text-current" />
								<span>{errorMessage}</span>
							</div>
						</div>
					{/if}

					<div class="form-control mt-6">
						<button type="submit" class="btn btn-primary">Send reset link</button>
					</div>
				</form>

				<div class="mt-4 text-center text-secondary">
					<a href="/login" class="link link-secondary">Back to login</a>
				</div>
			{/if}
		</div>
	</div>
</div>
