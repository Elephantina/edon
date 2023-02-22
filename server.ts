import { ConnInfo, Server as httpServer } from 'std/http/server.ts'
import { Handler, HandlerType } from './handler.ts'
import { Context } from './context.ts'
import { newResponse } from './util.ts'
import { FindRouter, RouterProps } from './route.ts'

export class Server {
	readonly #httpServer: httpServer
	readonly #onNoRoute: Handler
	readonly #findRouter: FindRouter

	constructor({
		hostname = 'locahost',
		port = 9800,
		onNoRoute = (ctx: Context): Promise<void> => {
			ctx.response.setStatus(404)
			return new Promise<void>((resolve) => resolve())
		},
		onError = (_: unknown) => newResponse(null, { status: 500 }),
		findRouter = (_: string): Promise<RouterProps> => {
			throw new Error('no config find router')
		},
	}) {
		this.#httpServer = new httpServer({ handler: this.serve, onError, hostname, port })
		this.#onNoRoute = onNoRoute
		this.#findRouter = findRouter
	}

	serve = async (req: Request, connInfo: ConnInfo): Promise<Response> => {
		const ctx = await this.#createCtx(req, connInfo)
		await ctx.next()
		return ctx.response.Response()
	}

	run = async (tlsConfig?: { certFile: string; keyFile: string }) => {
		await (tlsConfig
			? this.#httpServer.listenAndServeTls(tlsConfig!.certFile, tlsConfig!.keyFile)
			: this.#httpServer.listenAndServe())
	}

	close = () => this.#httpServer.close()

	#createCtx = async (req: Request, connInfo: ConnInfo): Promise<Context> => {
		const props = await this.#findRouter(new URL(req.url).pathname)
		if (props.type === HandlerType.Notfound) {
			props.handlers = [this.#onNoRoute]
		}

		return new Context(this, req, connInfo, props.params, props.type, props.handlers)
	}
}
