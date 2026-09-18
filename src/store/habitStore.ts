import { dateKey } from '@/helpers';
import { Habit } from '@/types/habitTrackerTypes';
import { ListStore } from './store';

export class HabitStore extends ListStore<Habit> {
	updateLog(habitId: string, date: Date, value: number) {
		const key = dateKey(date);

		this.set(
			this.value.map((h) =>
				h.id === habitId
					? { ...h, log: { ...h.log, [key]: value } }
					: h,
			),
		);
	}
}
