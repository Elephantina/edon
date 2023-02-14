import { Ctx } from './server.ts'
import { Component } from 'react'

export enum HandlerType {
	API = 'API',
	Component = 'Component',
	Notfound = 'Notfound',
}

export interface Handler {
	handle: (ctx: Ctx) => Promise<void>
}

export interface PageProps<T = unknown> {
	data: T
}

export interface ServerSideRendering {
	getServerSideProps: (ctx: Ctx) => Promise<PageProps>
}

export interface ServerSideGeneration {
	getStaticProps: (ctx: Ctx) => Promise<PageProps>
}

export interface WebComponent {
	default: Component<PageProps>
}

export interface Module {
	handle?: (ctx: Ctx) => Promise<void>
	getServerSideProps?: (ctx: Ctx) => Promise<PageProps>
	getStaticProps?: (ctx: Ctx) => Promise<PageProps>
	default?: Component<PageProps>
}

export const checkModule = async (name: string): Promise<Module> => {
	const mod: Module = {}
	const module = await import(name)

	try {
		const { handle }: Handler = module
		mod.handle = handle
	} catch {}
	try {
		const m: WebComponent = module
		mod.default = m.default
	} catch (_) {}
	try {
		const { getServerSideProps }: ServerSideRendering = module
		mod.getServerSideProps = getServerSideProps
	} catch (_) {}
	try {
		const { getStaticProps }: ServerSideGeneration = module
		mod.getStaticProps = getStaticProps
	} catch (_) {}

	if (mod.getServerSideProps && mod.getStaticProps) {
		throw new Error('Module can only have one of SSR and SSG')
	}
	if (!mod.default && (mod.getServerSideProps || mod.getStaticProps)) {
		throw new Error('Module must have default export')
	}
	return mod
}

/*
 针对文件

 Module 类型


 中间件   -> Handler 类型，导出为 Handler: (Ctx) => Promise<void>
 网页组件   -> React.Conpoment 类型，默认导出，导出为 default: React.Conpoment<PageProps>
 服务端渲染 ->  Handler 类型，非默认导出，导出为 SSR: (Ctx) => Promise<PageProps>

 执行顺序为，中间件 > SSR > 网页组件
 */

/*
 针对目录下的文件

 执行顺序

 忽略目录及三下划线文件

 按照字母序执行双下划线开头的文件但不包括三下划线: __a > __b > __c

 如果最终的组件为网页组件，还会依次执行 _a > _b > _c


 如果 path 为空，先匹配 index，其次为 [id]，最低优先级为 [...id]
 如果 path 不为空，优先匹配 path，其次为 path/ 下的文件，再其次为 [id]，最低优先级为 [...id]
 */

/*
 中间件规则

 每 **确认** 匹配到一个目录时，都会执行当前目录下的中间件

 例:

 GET /api/v1/user/admin/repo

 - /api/v1/ 存在 __auth
 - /api/v1/user/ 存在 __check_role
 - /api/v1/user/admin 存在 __check_username
 - /api/v1/user/admin/repo 文件中存在 Handler

 中间件执行顺序按上述依次

 ---

 对于一个目录中，同时存在 [id] 和 [...id] 时，会优先匹配 [id]

 但是如果同时存在 [...id] 和 a/b/c/[id] 的情况，会遵循深度优先的规则


















 */
