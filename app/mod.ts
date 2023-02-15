import { Component, ComponentType } from 'react'
import { Context } from '../context.ts'

export type EdonComonpentType<C extends Context, P> = ComponentType<P>

export type AppPropsType<P> = {
	pageProps: P
	Component: EdonComonpentType<Context, P>
}
export type AppProps<P> = AppPropsType<P>

export type AppTreeType<P> = ComponentType<{
	pageProps: P
}>

interface AppContextType<C extends Context, P> {
	Component: EdonComonpentType<C, P>
	AppTree: AppTreeType<P>
	ctx: Context
}

interface AppContext<C extends Context, P> {
	Component: EdonComonpentType<C, P>
}

// renderToReadableStream
// https://beta.reactjs.org/reference/react-dom/server/renderToReadableStream
