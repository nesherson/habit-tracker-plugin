import { App, TFile } from 'obsidian';
import { Habit } from './types';

export function uid() {
	return Math.random().toString(36).slice(2, 9);
}

export function getStartOfWeek(d: Date) {
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

export function weekRate(habit: Habit, days: Date[]) {
	const score = days.reduce(
		(n, d) => n + (isDone(habit, habit.log[dateKey(d)]) ? 1 : 0),
		0,
	);

	const completionPercentage =
		score >= habit.goal ? 100 : Math.round((score / habit.goal) * 100);

	return {
		score,
		denom: habit.goal,
		pct: completionPercentage,
	};
}

export function isDone(habit: Habit, v: number | null | undefined) {
	if (v == null) return false;

	return habit.type === 'num' ? Number(v) >= (habit.goal || 1) : v === 1;
}

export function streak(habit: Habit) {
	let streak = 0;
	let d = addDays(getStartOfWeek(new Date()), -7);

	while (true) {
		let finishedCount = 0;

		for (let i = 0; i < 7; i++) {
			if (isDone(habit, habit.log[dateKey(addDays(d, i))])) {
				finishedCount++;
			}
		}

		if (finishedCount >= habit.goal) {
			d = addDays(getStartOfWeek(d), -7);
			streak++;
		} else {
			break;
		}
	}

	return streak;
}

export async function addFrontmatterToFile(app: App, file: TFile, id: string) {
	await app.vault.process(file, (content) => {
		if (content.startsWith('---')) {
			return content.replace('---', `---\nht-id: ${id}`);
		}

		return `---\nht-id: ${id}\n---\n\n${content}`;
	});
}
