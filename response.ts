export class CtxResponse {
	status: number
	statusText: string
	headers: Headers
	body?: BodyInit

	constructor(status?: number, statusText?: string, headers?: HeadersInit, body?: BodyInit) {
		this.status = status ?? 200
		this.statusText = statusText ?? '' // TODO add find status
		this.headers = new Headers(headers)
		this.body = body
	}

	setStatus(status?: number, statusText?: string): CtxResponse {
		this.status = status ?? 200
		this.statusText = statusText ?? '200'
		return this
	}

	setHeader(headers?: HeadersInit): CtxResponse {
		this.headers = new Headers(headers)
		return this
	}

	addHeader(headers?: HeadersInit): CtxResponse {
		new Headers(headers).forEach((value, key) => this.headers.set(key, value))
		return this
	}

	setBody(body?: BodyInit): CtxResponse {
		if (this.body) {
			throw Error('body is exist')
		}
		this.body = body
		return this
	}

	Response(): Response {
		return new Response(this.body, {
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
		})
	}
}
