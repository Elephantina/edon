export { Context } from './context.ts'
export {
	type Component,
	type Handler,
	HandlerType,
	type PageProps,
	type ServerSideGeneration,
	type ServerSideRendering,
} from './handler.ts'
export { Response } from './response.ts'
export { Server } from './server.ts'

// export enum HandlerType {
// 	API = 'API',
// 	Component = 'Component',
// 	Notfound = 'Notfound',
// }
//
// export interface Handler {
// 	handle: (ctx: Context) => Promise<void>
// }
//
// export interface PageProps<T = unknown> {
// 	data: T
// }
//
// export interface ServerSideRendering {
// 	getServerSideProps: (ctx: Context) => Promise<PageProps>
// }
//
// export interface ServerSideGeneration {
// 	getStaticProps: (ctx: Context) => Promise<PageProps>
// }
//
// export interface Component {
