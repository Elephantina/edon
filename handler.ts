import { Component as RC } from 'react'
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
export type Component = RC<PageProps>
// export type ServerSideGeneration = (ctx: Context) => Promise<PageProps>

export interface Module {
	handle?: Handler
	getServerSideProps?: ServerSideRender
	default?: Component
}

export const checkModule = async (name: string): Promise<Module> => {
	const mod: Module = await import(name)
	if (!mod.default && mod.getServerSideProps) {
		throw new Error('Module must have default export')
	}
	if (!mod.handle && !mod.default && !mod.getServerSideProps) {
		throw new Error('Module must have at least one of handle, default, getServerSideProps or getStaticProps')
	}
	return mod
}
