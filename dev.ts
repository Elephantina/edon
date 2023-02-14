const a = await import('./test/route/_app.ts')
console.log(123)

const newRespone = (body?: BodyInit | null, init?: ResponseInit): Response => new Response(body, init)

// /** This Fetch API interface represents the response to a request. */
// interface Response extends Body {
//     readonly headers: Headers;
//     readonly ok: boolean;
//     readonly redirected: boolean;
//     readonly status: number;
//     readonly statusText: string;
//     readonly type: ResponseType;
//     readonly url: string;
//     clone(): Response;
// }

// declare var Response: {
//     prototype: Response;
//     new(body?: BodyInit | null, init?: ResponseInit): Response;
//     json(data: unknown, init?: ResponseInit): Response;
//     error(): Response;
//     redirect(url: string | URL, status?: number): Response;
// };
