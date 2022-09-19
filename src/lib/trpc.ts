import type { Router } from '../handlers' // 👈 only the types are imported from the server
import * as trpc from '@trpc/client'
import trpcTransformer from 'trpc-transformer'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'

const url = '/trpc'

export default (
	loadFetch?: (info: RequestInfo, init?: RequestInit | undefined) => Promise<Response>
) =>
	trpc.createTRPCClient<Router>({
		url: loadFetch ? '/trpc' : url,
		transformer: trpcTransformer,
		fetch(info, init?) {
			return ((loadFetch ? loadFetch : fetch) as typeof fetch)(info, {
				...init,
				credentials: 'include',
			})
		},
	})

type Query = keyof Router['_def']['queries']
type Mutation = keyof Router['_def']['mutations']

export type InferQueryOutput<RouteKey extends Query> = inferProcedureOutput<
	Router['_def']['queries'][RouteKey]
>
export type InferQueryInput<RouteKey extends Query> = inferProcedureInput<
	Router['_def']['queries'][RouteKey]
>
export type InferMutationOutput<RouteKey extends Mutation> = inferProcedureOutput<
	Router['_def']['mutations'][RouteKey]
>
export type InferMutationInput<RouteKey extends Mutation> = inferProcedureInput<
	Router['_def']['mutations'][RouteKey]
>
