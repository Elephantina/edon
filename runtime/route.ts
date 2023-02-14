import { checkModule, Module } from './handler.ts'

interface RouteNode {
	path: string // path, e.g: /api/v1/user/[:id] -> [:id]
	children?: Record<string, RouteNode>
	module?: Module[] | Module
}

const generateRoute = async (dirname: string) => {
	const root: RouteNode = {
		path: dirname.substring(dirname.lastIndexOf('/') + 1),
	}

	for (const dirEntry of Deno.readDirSync(dirname)) {
		if (dirEntry.isSymlink || (!dirEntry.name.endsWith('.ts') || !dirEntry.name.endsWith('.tsx'))) {
			continue
		}

		if (dirEntry.isFile && (dirEntry.name.startsWith('_') || dirEntry.name.startsWith('__'))) {
			if (!root.module) {
				root.module = []
			}
			(root.module as Module[]).push(await checkModule(`./${dirname}/${dirEntry.name}`))
			continue
		}

		if (!root.children) {
			root.children = {}
		}

		if (dirEntry.isDirectory) {
			root.children[dirEntry.name] = await generateRoute(`${dirname}/${dirEntry.name}`)
			continue
		}

		root.children[dirEntry.name] = {
			path: dirEntry.name.substring(0, dirEntry.name.lastIndexOf('.')),
			module: await checkModule(`./${dirname}/${dirEntry.name}`),
		}
	}

	return root
}

export const findRoute = async (dirname = 'src/route'): Promise<RouteNode> => {
	try {
		const node = await generateRoute(dirname)
		node.path = '' // is root
		return node
	} catch (err) {
		if (!(err instanceof Deno.errors.NotFound)) {
			throw err
		}
	}

	const node = await generateRoute('route')
	node.path = '' // is root
	return node
}
