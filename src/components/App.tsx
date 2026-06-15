import { useReducer, useState } from 'react';
import { HabitTrackerState } from '../types';
import { Toolbar } from './Toolbar';
import { Tracker } from './Tracker';
import { habitTrackerReducer } from '../reducer';
import { Side } from './Side';
import { getStartOfWeek } from '../helpers';
import { HabitTrackerContext } from '../context/habitTrackerContext';

interface ReactViewProps {
	initialState: HabitTrackerState;
}

export function App({ initialState }: ReactViewProps) {
	const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));
	const [state, dispatch] = useReducer(habitTrackerReducer, initialState);

	const handleStartOfWeekChange = (newDate: Date) => {
		setStartOfWeek(getStartOfWeek(newDate));
	};

	return (
		<HabitTrackerContext.Provider value={{ state, dispatch }}>
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
						/>
					</div>
					<Side
						focuses={state.focuses}
						todos={state.todos}
						readings={state.readings}
						notes={state.notes}
					/>
				</div>
			</div>
		</HabitTrackerContext.Provider>
	);
}
