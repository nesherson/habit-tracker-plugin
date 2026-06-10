export interface HabitTrackerState {
	habits: Habit[];
	focuses: KeyFocus[];
	todos: ToDo[];
	reading: Reading[];
	notes: Note[];
}

export interface Habit {
	id: string;
	name: string;
	color: string;
	type: string;
	goal: number;
	unit?: string;
	log: Record<string, number>;
}

export interface KeyFocus {
	id: string;
	label: string;
	done: number;
	total: number;
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
	id: string;
	label: string;
}
