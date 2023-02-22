import { Context } from './context.ts'

export enum HandlerType {
	API = 'API',
	Component = 'Component',
	Notfound = 'Notfound',
}

export type Handler = (ctx: Context) => Promise<void>
export interface Module {
	handle?: Handler
}

export const checkModule = async (name: string): Promise<Module> => {
	const mod: Module = await import(name)
	if (!mod.handle) {
		throw new Error('Module must have at least one of handle')
	}
	return mod
}
