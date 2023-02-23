import { red } from "https://deno.land/std@0.177.0/fmt/colors.ts";
import { buildMessage, diff, diffstr } from "https://deno.land/std@0.177.0/testing/_diff.ts";
import { format } from "https://deno.land/std@0.177.0/testing/_format.ts";
import { assert, assertEquals, equal } from 'std/testing/asserts.ts'
import { RingBuffer } from './ringbuffer.ts'

Deno.test('constructor', () => {
	const objectConstructor = () => {
		return { data: 1 }
	}
	const testdata = [
		{ initCapacity: -1, size: 2 },
		{ initCapacity: 0, size: 2 },
		{ initCapacity: 1, size: 2 },
		{ initCapacity: 1.1, size: 2 },
		{ initCapacity: 2, size: 2 },
		{ initCapacity: 3, size: 3 },
	]

	testdata.forEach((val) => {
		assertEquals(new RingBuffer({ objectConstructor, ...val }).size(), val.size, 'inconsistent size')
	})

	const rb = new RingBuffer({
		initCapacity: 2,
		objectConstructor,
	})
	assertEquals(rb.size(), 2, 'inconsistent size')
})

Deno.test('get and put', () => {
	const objectConstructor = () => {
		return { data: 1 }
	}
	const testdata = [
		{ initCapacity: 2, get: 2, put: 0, idle: 0 },
		{ initCapacity: 2, get: 0, put: 3, idle: 0 },
		{ initCapacity: 2, get: 3, put: 3, idle: 0 },
		{ initCapacity: 20, get: 1, put: 2, idle: 16 },
		{ initCapacity: 20, get: 0, put: 18, idle: 0 },
		{ initCapacity: 20, get: 0, put: 20, idle: 0 },
		{ initCapacity: 20, get: 30, put: 20, idle: 0 },
	]

	testdata.forEach((val) => {
		let { initCapacity, get, put, idle } = val
		const rb = new RingBuffer({ objectConstructor, initCapacity })
		while (get > 0) {
			get--
			rb.get()
		}
		while (put > 0) {
			put--
			rb.put(objectConstructor())
		}

		assertEquals(rb.idle(), idle, `${rb.idle()} ${idle} :inconsistent idle`)
	})
})

Deno.test('get and put boundary', () => {
	const objectConstructor = () => {
		return { data: 1 }
	}
	const testdata = [
		{
			crb: () => {
				const rb = new RingBuffer({ objectConstructor, initCapacity: 3 })
				rb.put(objectConstructor())
				rb.put(objectConstructor())
				rb.put(objectConstructor())
				return rb
			},
			idle: 0,
		},
		{
			crb: () => {
				const rb = new RingBuffer({ objectConstructor, initCapacity: 10 })
				let i = 10
				while (i > 0) {
					i--
					rb.put(objectConstructor())
				}
				i = 8
				while (i > 0) {
					i--
					rb.get()
				}
				rb.put(objectConstructor())
				rb.put(objectConstructor())

				return rb
			},
			idle: 6,
		},
	]

	testdata.forEach((val) => {
		const rb = val.crb()
		assertEquals(rb.idle(), val.idle, `${rb.idle()} ${val.idle} :inconsistent idle`)
	})
})

// reallocate

Deno.test('reallocate', () => {
	const objectConstructor = () => {
		return { data: 1 }
	}
	const testdata = [
		{
			crb: () => {
				const rb = new RingBuffer({ objectConstructor, initCapacity: 10 })
				let i = 8
				while (i > 0) {
					i--
					rb.put(objectConstructor())
				}
				return rb
			},
			expect: () => {
				const rb = new RingBuffer({ objectConstructor, initCapacity: 20 })
				let i = 8
				while (i > 0) {
					i--
					rb.put(objectConstructor())
				}
				return rb
			},
		},
	]

	testdata.forEach((val) => {
		const act = val.crb().reallocate(20)
		const exp = val.expect()
		
		assert(equal(act.size(), exp.size()),'Failed assertion')
		assert(equal(act.idle(), exp.idle()),'Failed assertion')
	})
})


