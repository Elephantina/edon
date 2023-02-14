import { findRoute } from './route.ts'
import { dirname, fromFileUrl, join, toFileUrl } from 'std/path/mod.ts'

Deno.test('route', async () => {
	// const entrypoint = new URL('./router_test.ts', import.meta.url).href;
	// console.log(entrypoint,dirname(fromFileUrl(import.meta.url)))
	const dir = dirname(fromFileUrl(import.meta.url))
	// console.log(join(dir,"./test"))
	const r = await findRoute(join(dir, './test/route'))
	// r.path

	console.log(r.path)
})

// Deno.test('import', async () => {
// 	const module = await import('./test/route/index.tsx')
// 	console.log(typeof module)
// })
