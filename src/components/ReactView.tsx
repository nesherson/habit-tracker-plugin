import { useReducer } from 'react';
import { HabitTrackerState } from '../types';
import { Toolbar } from './Toolbar';
import { Tracker } from './Tracker';
import { habitTrackerReducer } from '../reducer';

interface ReactViewProps {
	initialState: HabitTrackerState;
}

export function ReactView({ initialState }: ReactViewProps) {
	const [state, dispatch] = useReducer(habitTrackerReducer, initialState);

	return (
		<div className="ht-root">
			<Toolbar startOfWeekInitial={new Date()} habits={state.habits} />
			<div className="ht-body">
				<div className="ht-main">
					<Tracker
						startOfWeek={new Date()}
						habits={state.habits}
						dispatch={dispatch}
					/>
				</div>
			</div>
		</div>
	);
}
