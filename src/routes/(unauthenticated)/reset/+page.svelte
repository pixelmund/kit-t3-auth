<script lang="ts">
	import { z } from 'zod'
	import trpc from '$lib/trpc'
	import Field from '$lib/ui/forms/Field.svelte'
	import { createForm } from '$lib/ui/forms'
	import SubmitButton from '$lib/ui/forms/SubmitButton.svelte'
	import { page } from '$app/stores'
	import { invalidateAll } from '$app/navigation'

	const ResetPasswordSchema = z.object({
		password: z.string().min(6),
	})

	const { form, isSubmitting } = createForm({
		schema: ResetPasswordSchema,
		onSubmit: async ({ password }) => {
			await trpc().mutation('auth:resetPassword', {
				password,
				code: $page.url.searchParams.get('code') || '',
			})
			await invalidateAll()
		},
	})
</script>

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<img
			class="mx-auto h-12 w-auto"
			src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
			alt="Your Company" />
		<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
			Reset your password
		</h2>
	</div>
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form class="space-y-6" use:form method="POST">
				<Field name="password" label="New Password" type="password" />
				<div>
					<SubmitButton {isSubmitting} class="w-full">Reset password</SubmitButton>
				</div>
			</form>
		</div>
	</div>
</div>
