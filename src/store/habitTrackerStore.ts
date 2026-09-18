import {
	HabitTrackerState,
	ToDo,
} from '@/types/habitTrackerTypes';
import { CheckListStore } from './store';
import { HabitStore } from './habitStore';

export class HabitTrackerStore {
	readonly habits = new HabitStore();
	readonly todos = new CheckListStore<ToDo>();

	load(state: Partial<HabitTrackerState> = {}) {
		this.habits.set(state.habits ?? []);
		this.todos.set(state.todos ?? []);
	}

	toState(): HabitTrackerState {
		return {
			habits: this.habits.getSnapshot(),
			todos: this.todos.getSnapshot(),
		};
	}

	/** Notifies when any persisted slice changes. */
	onChange(listener: () => void) {
		const unsubscribes = [
			this.habits,
			this.todos,
		].map((store) => store.subscribe(listener));

		return () => {
			for (const unsubscribe of unsubscribes) unsubscribe();
		};
	}
}
