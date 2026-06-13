import { useReducer, useState } from 'react';
import { HabitTrackerState } from '../types';
import { Toolbar } from './Toolbar';
import { Tracker } from './Tracker';
import { habitTrackerReducer } from '../reducer';
import { Side } from './Side';
import { getStartOfWeek } from '../helpers';

interface ReactViewProps {
	initialState: HabitTrackerState;
}

export function ReactView({ initialState }: ReactViewProps) {
	const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));
	const [state, dispatch] = useReducer(habitTrackerReducer, initialState);

	const handleStartOfWeekChange = (newDate: Date) => {
		setStartOfWeek(getStartOfWeek(newDate));
	};

	return (
		<div className="ht-root">
			<Toolbar
				startOfWeek={startOfWeek}
				startOfWeekOnChange={handleStartOfWeekChange}
				habits={state.habits}
			/>
			<div className="ht-body">
				<div className="ht-main">
					<Tracker
						startOfWeek={startOfWeek}
						habits={state.habits}
						dispatch={dispatch}
					/>
				</div>
				<Side
					focuses={state.focuses}
					todos={state.todos}
					readings={state.readings}
					notes={state.notes}
					dispatch={dispatch}
				/>
			</div>
		</div>
	);
}
