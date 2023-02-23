// import { findRoute } from './route.ts'
// import { dirname, fromFileUrl, join, toFileUrl } from 'std/path/mod.ts'
// import { assert } from 'std/testing/asserts.ts'

// Deno.test('route', async () => {
// 	const dir = dirname(fromFileUrl(import.meta.url))
// 	const r = await findRoute(join(dir, './test/route'))
// 	console.log(r.path)
// })

// Deno.test('import', async () => {
// 	let { ass } = await import('./test/route/index.tsx') as {
// 		ass: string
// 	}
// 	ass ??= '{}'
// 	assert(ass, '{}')
// })
