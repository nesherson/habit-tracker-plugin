import { useSyncExternalStore } from 'react';
import { Store } from './store';

export function useStore<T>(store: Store<T>): T {
	return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
