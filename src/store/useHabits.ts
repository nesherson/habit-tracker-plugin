import { useSyncExternalStore } from 'react';
import { HabitStore } from './habitStore';

export function useHabits(store: HabitStore) {
	return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
