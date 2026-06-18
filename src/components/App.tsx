import { useEffect, useReducer, useState } from 'react';
import { HabitTrackerState, Note } from '../types';
import { Toolbar } from './Toolbar';
import { Tracker } from './Tracker';
import { habitTrackerReducer } from '../reducer';
import { Side } from './Side';
import { getStartOfWeek } from '../helpers';
import { HabitTrackerContext } from '../context/habitTrackerContext';
import HabitTracker from '../main';

interface AppProps {
	initialState: HabitTrackerState;
	plugin: HabitTracker;
}

export function App({ initialState, plugin }: AppProps) {
	const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));
	const [state, dispatch] = useReducer(habitTrackerReducer, initialState);
	const [isLoaded, setIsLoaded] = useState(false);

	const handleStartOfWeekChange = (newDate: Date) => {
		setStartOfWeek(getStartOfWeek(newDate));
	};

	useEffect(() => {
		if (!isLoaded) return;

		const timer = window.setTimeout(async () => {
			await plugin.savePluginData({ state });
		}, 500);

		return () => window.clearTimeout(timer);
	}, [state, isLoaded]);

	useEffect(() => {
		let saved = plugin.data?.state;

		plugin.dispatch = dispatch;

		if (plugin.noteIdMap.size > 0) {
			const notes: Note[] = Array.from(
				plugin.noteIdMap,
				([key, value]) => ({ path: key, label: value }),
			);

			saved = {
				...saved,
				notes: notes,
			};
		}

		dispatch({ type: 'LOAD_STATE', payload: saved });
		setIsLoaded(true);
	}, []);

	if (!isLoaded) return <div>Loading...</div>;

	return (
		<HabitTrackerContext.Provider
			value={{ state, dispatch, app: plugin.app }}
		>
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
