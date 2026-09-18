export interface PluginData {
	state: HabitTrackerState;
	settings: HabitTrackerSettings;
}

export interface HabitTrackerSettings {
	mySetting: string;
}

export interface HabitTrackerState {
	habits: Habit[];
	todos: ToDo[];
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

export interface ToDo {
	id: string;
	label: string;
	done: boolean;
}


export type HabitType = 'check' | 'num';
export type HabitUnit = 'pg' | 'mi';
