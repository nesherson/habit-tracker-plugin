import { Habit } from './types';

export function uid() {
	return Math.random().toString(36).slice(2, 9);
}

export function startOfWeek(d: Date) {
	// Monday
	const x = new Date(d);
	const dow = (x.getDay() + 6) % 7; // 0 = Mon
	x.setDate(x.getDate() - dow);
	x.setHours(0, 0, 0, 0);
	return x;
}

export function addDays(d: Date, n: number) {
	const x = new Date(d);

	x.setDate(x.getDate() + n);

	return x;
}

export function dateKey(d: Date) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	return `${y}-${m}-${day}`;
}

/* Completion rate measured only over days that have actually elapsed this week,
   so pre-ticking a future day never inflates the percentage */
export function weekRate(habit: Habit, days: Date[], todayKey: string) {
	const elapsed = days.filter((d) => dateKey(d) <= todayKey);
	const denom = elapsed.length || 7;
	const score = elapsed.reduce(
		(n, d) => n + (isDone(habit, habit.log[dateKey(d)]) ? 1 : 0),
		0,
	);

	return { score, denom, pct: Math.round((score / denom) * 100) };
}

export function isDone(habit: Habit, v: number | null | undefined) {
	if (v == null) return false;

	return habit.type === 'num' ? Number(v) >= (habit.goal || 1) : v === 1;
}
