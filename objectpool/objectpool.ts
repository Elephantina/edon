export interface ObjectPoolProps<T> {
	initialSize?: number
	objectConstructor: () => T
	maxCapacity: number
	minCapacity: number
	initCapacity: number
	recyclingInterval: number
}

export class ObjectPool<T> {
	#pool: T[] = []
	#nextFreeSlot = 0
	#objectConstructor: () => T

	constructor({ initialSize = 100, objectConstructor }: ObjectPoolProps<T>) {
		this.#objectConstructor = objectConstructor
		this.#pool = Array<T>(initialSize).map(() => this.#objectConstructor())
	}
}
