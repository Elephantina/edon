export interface RingBufferProps<T> {
	initCapacity: number
	objectConstructor: () => T
}

export class RingBuffer<T> {
	#buf: (T | undefined)[]
	#objectConstructor: () => T
	#r = 0
	#w = 1

	constructor({
		initCapacity = 256,
		objectConstructor,
	}: RingBufferProps<T>) {
		if (initCapacity < 2) {
			initCapacity = 2
		}

		this.#objectConstructor = objectConstructor
		this.#buf = new Array<T | undefined>(initCapacity)
		this.#buf[0] = objectConstructor()
	}

	get = (): T => {
		if (
			(this.#r + 1 === this.#w) || // r === 0 && w === 1
			(this.#r + 1 === this.size() && this.#w === 0) // r === lenght-1 && w === 0
		) {
			return this.#objectConstructor() // no more to read
		}

		const obj = this.#buf[this.#r] as T
		this.#buf[this.#r] = undefined
		this.#r++
		if (this.#r === this.size()) {
			this.#r = 0
		}

		return obj
	}

	put = (t: T): void => {
		if (
			(this.#w + 1 === this.#r) || // r === 1 && w === 0
			(this.#w + 1 === this.size() && this.#r === 0) // r === 0 && w === lenght-1
		) {
			return //  no more to write
		}

		this.#buf[this.#w] = t
		this.#w++
		if (this.#w === this.size()) {
			this.#w = 0
		}
	}

	size = () => this.#buf.length
	idle = () => this.#r > this.#w ? this.#r - this.#w - 1 : this.size() - this.#w + this.#r - 1

	reallocate = (initCapacity: number): RingBuffer<T> => {
		if (initCapacity < 2) {
			initCapacity = 2
		}

		const objectConstructor = this.#objectConstructor
		const rb = new RingBuffer<T>({ initCapacity, objectConstructor })

		const available = this.#r < this.#w
			? this.#buf.slice(this.#r, this.#w)
			: this.#buf.slice(0, this.#w).concat(this.#buf.slice(this.#r))

		if (available.length >= initCapacity) {
			rb.#buf = available.slice(0, initCapacity)
			rb.#r = 1
			rb.#w = 0
		} else {
			console.log(rb.#w, available.length, initCapacity)
			rb.#w = available.length
			rb.#buf = available.concat(new Array<T>(initCapacity - available.length))
		}

		return rb
	}
}
