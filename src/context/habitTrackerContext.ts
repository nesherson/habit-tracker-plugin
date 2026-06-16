import { createContext, useContext } from 'react';
import { HabitTrackerState } from '../types';
import { HabitTrackerAction } from '../reducer';
import { App } from 'obsidian';

interface HabitContextType {
	state: HabitTrackerState;
	dispatch: React.Dispatch<HabitTrackerAction>;
	app: App;
}

export const HabitTrackerContext = createContext<HabitContextType | null>(null);

export function useHabit() {
	const ctx = useContext(HabitTrackerContext);

	if (!ctx) throw new Error('useHabit must be used inside HabitProvider');

	return ctx;
}
