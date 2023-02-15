import { Response } from './response.ts'
import { ConnInfo } from 'std/http/server.ts'
import { Handler, HandlerType } from './handler.ts'
import { Server } from './server.ts'

export class Context {
	readonly request: Request
	readonly response: Response
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
		this.response = new Response()
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
			await this.#handlers[this.#index](this)
			this.#index++
		}
	}
}
