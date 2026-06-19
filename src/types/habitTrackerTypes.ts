export interface PluginData {
	state: HabitTrackerState;
	settings: HabitTrackerSettings;
}

export interface HabitTrackerSettings {
	mySetting: string;
}

export interface HabitTrackerState {
	habits: Habit[];
	focuses: KeyFocus[];
	todos: ToDo[];
	readings: Reading[];
	notes: Note[];
}

export interface Habit {
	id: string;
	name: string;
	color: string;
	type: HabitType;
	goal: number;
	unit?: HabitUnit;
	log: Record<string, number>;
}

export interface KeyFocus {
	id: string;
	label: string;
}

export interface ToDo {
	id: string;
	label: string;
	done: boolean;
}

export interface Reading {
	id: string;
	label: string;
	done: boolean;
}

export interface Note {
	path: string;
	label: string;
}

export type HabitType = 'check' | 'num';
export type HabitUnit = 'pg' | 'mi';
