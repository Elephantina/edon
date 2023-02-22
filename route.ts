import { checkModule, Handler, HandlerType, Module } from './handler.ts'
import { walk } from 'std/fs/walk.ts'
import { toFileUrl } from 'std/path/mod.ts'

export const findRoute = async (dir: string): Promise<RouterFile> => {
	const node = await routeTraversal(dir)
	return node
}

export type RouterProps = {
	params: Record<string, string>
	type: HandlerType
	handlers: Handler[]
}

export type FindRouter = (path: string) => Promise<RouterProps>

class RouterFile {
	readonly #dirname: string // file:///data/route/api/v1/user/[:id] -> file:///data
	readonly path: string // /api/v1/user/[:id] -> ''
	#middleware: Module[] = []
	#children: RouterFile[] = []
	#ad?: Module

	constructor(dirname: string, path: string) {
		this.#dirname = dirname
		this.path = path
	}

	async addFile(path: string) {
		const mod = await checkModule(path)

		path = path.substring(this.#dirname.length + 1)
		const node = this.findAndCreateChild(path)
		const filename = path.substring(path.lastIndexOf('/') + 1)

		if (filename.startsWith('_')) {
			node.#middleware.push(mod)
		} else {
			node.#ad = mod
		}
	}

	// findAndCreateChild path must is api/v1/user/[:id]
	findAndCreateChild(path: string): RouterFile {
		const idx = path.indexOf('/')
		if (idx === -1) {
			return this
		}
		const p = path.substring(0, idx)

		for (const node of this.#children) {
			if (node.path === p) {
				return node.findAndCreateChild(path.substring(idx + 1))
			}
		}
		const node = new RouterFile(this.#dirname, p)
		this.#children.push(node)
		return node.findAndCreateChild(path.substring(idx + 1))
	}
}

async function routeTraversal(dirname: string): Promise<RouterFile> {
	const routesFolder = walk(dirname, {
		includeDirs: false,
		includeFiles: true,
		followSymlinks: false,
		exts: ['tsx', 'ts'],
	})

	const files: string[] = []
	for await (const entry of routesFolder) {
		files.push(toFileUrl(entry.path).toString())
	}
	files.sort()

	const rf = new RouterFile(dirname, '')

	for (const file of files) {
		await rf.addFile(file)
	}

	return rf
}
