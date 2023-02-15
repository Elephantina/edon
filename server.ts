import { ConnInfo, Server as httpServer } from 'std/http/server.ts'
import { Handler, HandlerType } from './handler.ts'
import { Context } from './context.ts'
import { newResponse } from './util.ts'

export class Server {
	readonly #httpServer: httpServer
	readonly #onNoRoute: Handler

	constructor({
		hostname = 'locahost',
		port = 9800,
		onNoRoute = (ctx: Context): Promise<void> => {
			ctx.response.setStatus(404)
			return new Promise<void>((resolve) => resolve())
		},
		onError = (_: unknown) => newResponse(null, { status: 500 }),
	}) {
		this.#httpServer = new httpServer({ handler: this.serve, onError, hostname, port })
		this.#onNoRoute = onNoRoute
	}

	async serve(req: Request, connInfo: ConnInfo): Promise<Response> {
		const ctx = this.#createCtx(req, connInfo)
		await ctx.next()
		return ctx.response.Response()
	}

	async run(tlsConfig?: { certFile: string; keyFile: string }) {
		await (tlsConfig
			? this.#httpServer.listenAndServeTls(tlsConfig!.certFile, tlsConfig!.keyFile)
			: this.#httpServer.listenAndServe())
	}

	close = () => this.#httpServer.close()

	findRouter(url: URL): RouterProps {
		// return new Context(new Server(), req, connInfo, {}, HandlerType.API, [])

		return { params: {}, type: HandlerType.Notfound, handlers: [this.#onNoRoute] }
	}

	#createCtx(req: Request, connInfo: ConnInfo): Context {
		const props = this.findRouter(new URL(req.url))
		return new Context(this, req, connInfo, props.params, props.type, props.handlers)
	}
}

type RouterProps = {
	params: Record<string, string>
	type: HandlerType
	handlers: Handler[]
}
