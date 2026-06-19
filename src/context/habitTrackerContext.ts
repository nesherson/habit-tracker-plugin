import { createContext, useContext, Dispatch } from 'react';
import { HabitTrackerState } from '../types/habitTrackerTypes';
import { HabitTrackerAction } from '../store/reducer';
import { App } from 'obsidian';

interface HabitContextType {
	state: HabitTrackerState;
	dispatch: Dispatch<HabitTrackerAction>;
	app: App;
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
