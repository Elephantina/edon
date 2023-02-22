import { Context } from './context.ts'

export enum HandlerType {
	API = 'API',
	Component = 'Component',
	Notfound = 'Notfound',
}

export interface PageProps<T = unknown> {
	data: T
}
export type Handler = (ctx: Context) => Promise<void>
export type ServerSideRender = (ctx: Context) => Promise<PageProps>

export interface Module {
	handle?: Handler
	getServerSideProps?: ServerSideRender
}

export const checkModule = async (name: string): Promise<Module> => {
	const mod: Module = await import(name)
	if (!mod.handle && !mod.getServerSideProps) {
		throw new Error('Module must have at least one of handle, default, getServerSideProps or getStaticProps')
	}
	return mod
}
