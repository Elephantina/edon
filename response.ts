import { newResponse } from './util.ts'

export class Response {
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

	setStatus(status?: number, statusText?: string): Response {
		this.status = status ?? 200
		this.statusText = statusText ?? '200'
		return this
	}

	setHeader(headers?: HeadersInit): Response {
		this.headers = new Headers(headers)
		return this
	}

	addHeader(headers?: HeadersInit): Response {
		new Headers(headers).forEach((value, key) => this.headers.set(key, value))
		return this
	}

	setBody(body?: BodyInit): Response {
		if (this.body) {
			throw Error('body is exist')
		}
		this.body = body
		return this
	}

	Response = () => newResponse(this.body, { status: this.status, statusText: this.statusText, headers: this.headers })
}
