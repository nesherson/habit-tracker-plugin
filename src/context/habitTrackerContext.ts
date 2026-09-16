import { createContext, useContext } from 'react';
import { App } from 'obsidian';
import HabitTracker from '@/main';

interface HabitContextType {
	app: App;
	plugin: HabitTracker
}

export const HabitTrackerContext = createContext<HabitContextType | null>(null);

export function useHabitTrackerContext() {
	const ctx = useContext(HabitTrackerContext);

	if (!ctx)
		throw new Error(
			'useHabitTrackerContext must be used inside HabitProvider',
		);

	return ctx;
}
