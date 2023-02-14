import { ConnInfo } from 'std/http/server.ts'
import { Handler, HandlerType } from './handler.ts'
import { CtxResponse } from './response.ts'

export const serve = async (req: Request, connInfo: ConnInfo): Promise<Response> => {
	const ctx = createCtx(req, connInfo)
	await ctx.next()
	return ctx.response.Response()
}

export const createCtx = (req: Request, connInfo: ConnInfo): Ctx => {
	return new Ctx({ a: '1' }, req, connInfo, {}, HandlerType.API, [])
}

export class Ctx {
	readonly request: Request
	readonly response: CtxResponse
	readonly connInfo: ConnInfo
	readonly url: URL
	readonly params: Record<string, string>

	readonly type: HandlerType
	readonly server: Server
	readonly #handlers: Handler[]
	#index: number

	constructor(
		server: Server,
		req: Request,
		connInfo: ConnInfo,
		params: Record<string, string>,
		type: HandlerType,
		handlers: Handler[],
	) {
		this.request = req
		this.response = new CtxResponse()
		this.connInfo = connInfo
		this.url = new URL(req.url)
		this.params = params

		this.type = type
		this.server = server
		this.#index = -1
		this.#handlers = handlers
	}

	async next() {
		this.#index++

		while (this.#index < this.#handlers.length) {
			await this.#handlers[this.#index].handle(this)
			this.#index++
		}
	}
}

export interface Server {
	a: string
}
