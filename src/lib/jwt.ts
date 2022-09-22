import { createSigner, createVerifier } from 'fast-jwt'
import { JWT_SECRET } from '$env/static/private'

const signer = createSigner({ key: JWT_SECRET, expiresIn: 7 * 24 * 60 * 60 * 1000 })
const verifier = createVerifier({ key: JWT_SECRET })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signJWT<T extends { [key: string]: any }>(payload: T) {
	return signer(payload)
}

export async function verifyJWT<T>(token: string): Promise<T | null> {
	try {
		return verifier(token)
	} catch (error) {
		return null
	}
}
