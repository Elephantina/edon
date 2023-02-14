import { ConnInfo } from 'std/http/server.ts'
import { Handler, HandlerType } from './handler.ts'
import { Context } from './context.ts'

export class Server {
	readonly listenAddr: Deno.ListenOptions = { hostname: 'localhost', port: 9810 }
	// readonly #base: string
	// readonly #entrypoint: string
	// readonly #route: Map<string, HandlerType>
	// readonly #_404:Handler
	// readonly #_500:Handler
	// readonly #_400:Handler

	async serve(req: Request, connInfo: ConnInfo): Promise<Response> {
		const ctx = this.#createCtx(req, connInfo)
		await ctx.next()
		return ctx.response.Response()
	}

	async run() {
		const ln = Deno.listen(this.listenAddr)
		for await (const conn of ln) {
			this.serveHttp(conn)
		}
	}

	async serveHttp(conn: Deno.Conn) {
		const hc = Deno.serveHttp(conn)
		for await (const requestEvent of hc) {
			requestEvent.respondWith(this.serve(requestEvent.request, conn))
		}
	}

	findRouter(url: URL): RouterProps | null {
		// return new Context(new Server(), req, connInfo, {}, HandlerType.API, [])

		return null
	}

	#createCtx(req: Request, connInfo: ConnInfo): Context {
		const props = this.findRouter(new URL(req.url))
		if (props === null) {
			return new Context(new Server(), req, connInfo, {}, HandlerType.API, [])
		}
		return new Context(new Server(), req, connInfo, props.params, props.type, props.handlers)
	}
}

type RouterProps = {
	params: Record<string, string>
	type: HandlerType
	handlers: Handler[]
}
