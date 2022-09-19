/* eslint-disable @typescript-eslint/no-explicit-any */
import { reporter } from '@felte/reporter-svelte'
import { validator } from '@felte/validator-zod'
import { TRPCClientError } from '@trpc/client'
import { createForm as createFelteForm } from 'felte'
import type { z, ZodType } from 'zod'
import { toast } from '@zerodevx/svelte-toast'

type RecursivePartial<T extends Record<string, any>> = {
	[P in keyof T]?: T[P] extends Record<string, any> | Array<any> ? RecursivePartial<T[P]> : T[P]
}

export function createForm<T extends ZodType<any, any, any>>({
	schema,
	initialValues,
	onSubmit,
	onError,
}: {
	schema: T
	initialValues?: RecursivePartial<z.infer<T>>
	onSubmit: (values: z.infer<T>, context: any) => Promise<unknown> | unknown
	onError?: (error: unknown) => any
}) {
	const { setErrors, ...rest } = createFelteForm<z.infer<T>>({
		onSubmit,
		initialValues,
		onError: async (error: any) => {
			if (error instanceof TRPCClientError || error?.data?.code) {
				if (error.data?.code === 'BAD_REQUEST') {
					const jsonError = JSON.parse(error.message)
					const errors: any = {}

					jsonError.forEach((err: any) => {
						errors[err.path[0]] = err.message
					})

					setErrors(errors)
				}
			}

			if (onError) {
				await onError(error)
			}

			toast.push(error.message, {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030',
				},
			})
		},
		extend: [validator({ schema }), reporter],
	})

	return {
		setErrors,
		...rest,
	}
}
