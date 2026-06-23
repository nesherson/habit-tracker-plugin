import { uid } from './helpers';
import { initialState } from './store/reducer';
import {
	HabitTrackerSettings,
	HabitTrackerState,
	PluginData,
} from './types/habitTrackerTypes';

export const DEFAULT_SETTINGS: HabitTrackerSettings = {
	mySetting: 'default',
};

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const defaultPluginData: PluginData = {
	state: initialState,
	settings: DEFAULT_SETTINGS,
};

export function seedKey(offset: number) {
	const d = new Date();

	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() + offset);

	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	return `${y}-${m}-${day}`;
}

export function seedLog(pattern: (number | null)[]) {
	const log: Record<string, number> = {};

	pattern.forEach((v, i) => {
		if (v != null) log[seedKey(i - pattern.length)] = v;
	});

	return log;
}
export function seedData(): HabitTrackerState {
	const C = (p: (number | null)[]) => seedLog(p);
	const N = (p: (number | null)[]) => seedLog(p);

	return {
		habits: [
			{
				id: uid(),
				name: 'Wake up early',
				color: '#7c6cdf',
				type: 'check',
				goal: 5,
				log: C([1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0]),
			},
			{
				id: uid(),
				name: 'Gym / Exercise',
				color: '#4b86d8',
				type: 'check',
				goal: 1,
				log: C([1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0]),
			},
			{
				id: uid(),
				name: 'Read',
				color: '#d2922f',
				type: 'num',
				goal: 30,
				unit: 'pg',
				log: N([20, 40, 0, 35, 50, 0, 30, 42, 30, 0, 55, 20, 0, 18]),
			},
			{
				id: uid(),
				name: 'Meditate',
				color: '#d2647a',
				type: 'check',
				goal: 5,
				log: C([1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1]),
			},
			{
				id: uid(),
				name: 'Deep work session',
				color: '#7c6cdf',
				type: 'check',
				goal: 1,
				log: C([1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0]),
			},
			{
				id: uid(),
				name: 'Run',
				color: '#3fa35f',
				type: 'num',
				goal: 3,
				unit: 'mi',
				log: N([
					3.2, 0, 4.1, 0, 2.0, 5.5, 0, 3.4, 0, 3.1, 0, 2.5, 4.0, 0,
				]),
			},
			{
				id: uid(),
				name: 'Journal',
				color: '#4b86d8',
				type: 'check',
				goal: 1,
				log: C([1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0]),
			},
		],
		focuses: [
			{ id: uid(), label: 'Ship planner plugin v0.2' },
			{
				id: uid(),
				label: 'Re-establish morning routine',
			},
			{
				id: uid(),
				label: 'Close out onboarding project',
			},
		],
		todos: [
			{ id: uid(), label: 'Invest 5h in studying', done: false },
			{ id: uid(), label: 'Fix sync bug #214', done: false },
			{ id: uid(), label: 'Schedule eye exam', done: false },
		],
		readings: [
			{ id: uid(), label: 'Outsourcing thinking', done: false },
			{ id: uid(), label: 'Designing data-heavy UIs', done: false },
		],
		notes: [],
	};
}
