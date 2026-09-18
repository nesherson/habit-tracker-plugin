type Listener = () => void;

export class Store<T> {
	private listeners = new Set<Listener>();

	constructor(protected value: T) {}

	subscribe = (listener: Listener) => {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	};

	getSnapshot = () => this.value;

	set(value: T) {
		if (Object.is(value, this.value)) return;

		this.value = value;

		for (const listener of this.listeners) {
			listener();
		}
	}
}

export class ListStore<T extends { id: string }> extends Store<T[]> {
	constructor(initial: T[] = []) {
		super(initial);
	}

	add(item: T) {
		this.set([...this.value, item]);
	}

	update(id: string, changes: Partial<Omit<T, 'id'>>) {
		this.set(
			this.value.map((item) =>
				item.id === id ? { ...item, ...changes } : item,
			),
		);
	}

	remove(id: string) {
		this.set(this.value.filter((item) => item.id !== id));
	}
}

export class CheckListStore<
	T extends { id: string; done: boolean },
> extends ListStore<T> {
	toggle(id: string) {
		this.set(
			this.value.map((item) =>
				item.id === id ? { ...item, done: !item.done } : item,
			),
		);
	}
}
