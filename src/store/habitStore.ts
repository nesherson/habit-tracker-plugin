import { dateKey } from '@/helpers';
import { Habit } from '@/types/habitTrackerTypes';

export type HabitChanges = Partial<Omit<Habit, 'id'>>;

export class HabitStore {
	private habits: Habit[] = [];
	private listeners = new Set<() => void>();

	subscribe = (onStoreChange: () => void) => {
		this.listeners.add(onStoreChange);

		return () => {
			this.listeners.delete(onStoreChange);
		};
	};

	getSnapshot = () => this.habits;

	setHabits(habits: Habit[]) {
		this.habits = habits;

		for (const listener of this.listeners) {
			listener();
		}
	}

	createHabit(habit: Habit) {
		this.setHabits([...this.habits, habit]);
	}

	updateHabit(id: string, changes: HabitChanges) {
		this.setHabits(
			this.habits.map((h) => (h.id === id ? { ...h, ...changes } : h)),
		);
	}

	removeHabit(id: string) {
		this.setHabits(this.habits.filter((h) => h.id !== id));
	}

	updateHabitLog(habitId: string, date: Date, value: number) {
		const key = dateKey(date);

		this.setHabits(
			this.habits.map((h) =>
				h.id === habitId
					? { ...h, log: { ...h.log, [key]: value } }
					: h,
			),
		);
	}
}
