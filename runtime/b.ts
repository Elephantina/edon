interface mmm {
	// x: 4
	// y: string
	// deno-lint-ignore ban-types
	default: Function
}

async function checks() {
	try {
		const mod: mmm = await import('./a.ts')
		console.log(typeof mod, mod)
	} catch (error) {
		console.log(error)
	}
}

await checks()
