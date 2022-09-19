import { dev } from '$app/environment'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authenticateUser, hashPassword, verifyPassword } from '../lib/auth'
import { createCookie, destroyCookie } from '../lib/cookie'
import { db } from '../lib/db'
import { signJWT } from '../lib/jwt'
import { createRouter } from '../lib/trpc.server'

export const auth = createRouter()
	.mutation('login', {
		input: z
			.object({
				email: z.string().min(2),
				password: z.string().min(6),
			})
			.refine(
				async ({ password, email }) => {
					const user = await db.user.findFirst({
						where: { email },
						select: { hashedPassword: true },
					})
					if (!user) return false
					return verifyPassword(user.hashedPassword, password)
				},
				{ message: 'Password is invalid.', path: ['password'] }
			),
		resolve: async ({ input, ctx }) => {
			const user = await authenticateUser(input.email, input.password)
			ctx.jwtCookie = createCookie('uid', await signJWT({ id: user.id }), 7 * 24 * 60 * 60)
			return {
				isLoggedIn: true,
				user: { id: user.id },
			}
		},
	})
	.mutation('register', {
		input: z.object({
			name: z.string().optional(),
			email: z
				.string()
				.min(1)
				.email()
				.refine(
					async (email) => {
						return (await db.user.count({ where: { email } })) === 0
					},
					{ message: 'E-Mail is already in use' }
				),
			password: z.string().min(6),
		}),
		resolve: async ({ input, ctx }) => {
			const user = await db.user.create({
				data: {
					email: input.email,
					name: input.name,
					hashedPassword: await hashPassword(input.password),
				},
			})

			ctx.jwtCookie = createCookie('uid', await signJWT({ id: user.id }), 7 * 24 * 60 * 60)

			return {
				isLoggedIn: true,
				user: { id: user.id },
			}
		},
	})
	.mutation('logout', {
		resolve: async ({ ctx }) => {
			ctx.jwtCookie = destroyCookie('uid')
			return {
				isLoggedIn: false,
			}
		},
	})
	.mutation('forgotPassword', {
		input: z.object({
			email: z.string().email(),
		}),
		resolve: async ({ input }) => {
			const existingReset = await db.passwordReset.findFirst({
				where: { user: { email: input.email }, deletedAt: null },
			})

			if (existingReset) {
				await db.passwordReset.delete({ where: { id: existingReset.id } })
			}

			try {
				const passwordReset = await db.passwordReset.create({
					data: {
						expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
						user: {
							connect: {
								email: input.email,
							},
						},
					},
				})

				if (dev) {
					console.log(`[DEBUG]: Password Reset - ${passwordReset.id}`)
				}

				return {
					ok: true,
				}
			} catch (error) {
				return {
					ok: true,
				}
			}
		},
	})
	.query('verifyResetToken', {
		input: z.object({
			code: z.string().uuid(),
		}),
		resolve: async ({ input }) => {
			const passwordReset = await db.passwordReset.findFirst({
				where: { id: input.code, deletedAt: null },
			})
			
			if (!passwordReset) {
				return { ok: false }
			}

			if (Date.now() > passwordReset.expiresAt.getTime()) {
				return {
					ok: false,
				}
			}

			return {
				ok: true,
			}
		},
	})
	.mutation('resetPassword', {
		input: z.object({
			code: z.string().uuid(),
			password: z.string().min(6),
		}),
		resolve: async ({ input, ctx }) => {
			const passwordReset = await db.passwordReset.findFirstOrThrow({
				where: { id: input.code, deletedAt: null },
			})

			if (Date.now() > passwordReset.expiresAt.getTime()) {
				throw new TRPCError({ code: 'TIMEOUT', message: 'Your password reset already expired' })
			}

			await db.passwordReset.update({
				where: {
					id: passwordReset.id,
				},
				data: {
					deletedAt: new Date(),
				},
			})

			const user = await db.user.update({
				where: { id: passwordReset.userId },
				data: { hashedPassword: await hashPassword(input.password) },
			})

			ctx.jwtCookie = createCookie('uid', await signJWT({ id: user.id }), 7 * 24 * 60 * 60)

			return {}
		},
	})
