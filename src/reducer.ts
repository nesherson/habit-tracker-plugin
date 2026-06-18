import {
	Habit,
	HabitTrackerState,
	KeyFocus,
	Note,
	Reading,
	ToDo,
} from './types';

// ─── Action Types ────────────────────────────────────────────────────────────

export type HabitTrackerAction =
	// Habits
	| { type: 'ADD_HABIT'; payload: Habit }
	| {
			type: 'UPDATE_HABIT';
			payload: { id: string } & Partial<Omit<Habit, 'id' | 'log'>>;
	  }
	| { type: 'REMOVE_HABIT'; payload: { id: string } }
	| {
			type: 'UPDATE_HABIT_LOG';
			payload: { id: string; key: string; value: number };
	  }
	| { type: 'REMOVE_HABIT_LOG_ENTRY'; payload: { id: string; key: string } }
	// Key Focuses
	| { type: 'ADD_FOCUS'; payload: KeyFocus }
	| {
			type: 'UPDATE_FOCUS';
			payload: { id: string } & Partial<Omit<KeyFocus, 'id'>>;
	  }
	| { type: 'REMOVE_FOCUS'; payload: { id: string } }
	// Todos
	| { type: 'ADD_TODO'; payload: ToDo }
	| {
			type: 'UPDATE_TODO';
			payload: { id: string } & Partial<Omit<ToDo, 'id'>>;
	  }
	| { type: 'TOGGLE_TODO'; payload: { id: string } }
	| { type: 'REMOVE_TODO'; payload: { id: string } }
	// Reading
	| { type: 'ADD_READING'; payload: Reading }
	| {
			type: 'UPDATE_READING';
			payload: { id: string } & Partial<Omit<Reading, 'id'>>;
	  }
	| { type: 'TOGGLE_READING'; payload: { id: string } }
	| { type: 'REMOVE_READING'; payload: { id: string } }
	// Notes
	| { type: 'ADD_NOTE'; payload: Note }
	| { type: 'LOAD_STATE'; payload: HabitTrackerState }
	| { type: 'LOAD_NOTES'; payload: Note[] };

// ─── Initial State ───────────────────────────────────────────────────────────

export const initialState: HabitTrackerState = {
	habits: [],
	focuses: [],
	todos: [],
	readings: [],
	notes: [],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function updateById<T extends { id: string }>(
	items: T[],
	id: string,
	changes: Partial<T>,
): T[] {
	return items.map((item) =>
		item.id === id ? { ...item, ...changes } : item,
	);
}

function removeById<T extends { id: string }>(items: T[], id: string): T[] {
	return items.filter((item) => item.id !== id);
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

export function habitTrackerReducer(
	state: HabitTrackerState,
	action: HabitTrackerAction,
): HabitTrackerState {
	switch (action.type) {
		// ── Habits ──────────────────────────────────────────────────────────────

		case 'ADD_HABIT':
			return { ...state, habits: [...state.habits, action.payload] };

		case 'UPDATE_HABIT': {
			const { id, ...changes } = action.payload;
			return { ...state, habits: updateById(state.habits, id, changes) };
		}

		case 'REMOVE_HABIT':
			return {
				...state,
				habits: removeById(state.habits, action.payload.id),
			};

		/**
		 * UPDATE_HABIT_LOG
		 * Sets (or overwrites) a single log entry on a habit.
		 *
		 * payload.id    – the habit to target
		 * payload.key   – the log key, typically an ISO date string e.g. "2026-06-10"
		 * payload.value – the numeric value to record
		 */
		case 'UPDATE_HABIT_LOG':
			return {
				...state,
				habits: state.habits.map((habit) =>
					habit.id === action.payload.id
						? {
								...habit,
								log: {
									...habit.log,
									[action.payload.key]: action.payload.value,
								},
							}
						: habit,
				),
			};

		/**
		 * REMOVE_HABIT_LOG_ENTRY
		 * Deletes a single log entry by key from a habit.
		 */
		case 'REMOVE_HABIT_LOG_ENTRY':
			return {
				...state,
				habits: state.habits.map((habit) => {
					if (habit.id !== action.payload.id) return habit;
					const { [action.payload.key]: _removed, ...remainingLog } =
						habit.log;
					return { ...habit, log: remainingLog };
				}),
			};

		// ── Key Focuses ──────────────────────────────────────────────────────────

		case 'ADD_FOCUS':
			return { ...state, focuses: [...state.focuses, action.payload] };

		case 'UPDATE_FOCUS': {
			const { id, ...changes } = action.payload;
			return {
				...state,
				focuses: updateById(state.focuses, id, changes),
			};
		}

		case 'REMOVE_FOCUS':
			return {
				...state,
				focuses: removeById(state.focuses, action.payload.id),
			};

		// ── Todos ────────────────────────────────────────────────────────────────

		case 'ADD_TODO':
			return { ...state, todos: [...state.todos, action.payload] };

		case 'UPDATE_TODO': {
			const { id, ...changes } = action.payload;
			return { ...state, todos: updateById(state.todos, id, changes) };
		}

		case 'TOGGLE_TODO':
			return {
				...state,
				todos: state.todos.map((todo) =>
					todo.id === action.payload.id
						? { ...todo, done: !todo.done }
						: todo,
				),
			};

		case 'REMOVE_TODO':
			return {
				...state,
				todos: removeById(state.todos, action.payload.id),
			};

		// ── Reading ──────────────────────────────────────────────────────────────

		case 'ADD_READING':
			return { ...state, readings: [...state.readings, action.payload] };

		case 'UPDATE_READING': {
			const { id, ...changes } = action.payload;
			return {
				...state,
				readings: updateById(state.readings, id, changes),
			};
		}

		case 'TOGGLE_READING':
			return {
				...state,
				readings: state.readings.map((item) =>
					item.id === action.payload.id
						? { ...item, done: !item.done }
						: item,
				),
			};

		case 'REMOVE_READING':
			return {
				...state,
				readings: removeById(state.readings, action.payload.id),
			};

		// ── Notes ────────────────────────────────────────────────────────────────

		case 'ADD_NOTE':
			return { ...state, notes: [...state.notes, action.payload] };

		case 'LOAD_STATE':
			return action.payload;

		case 'LOAD_NOTES':
			return {
				...state,
				notes: action.payload,
			};

		default:
			return state;
	}
}
