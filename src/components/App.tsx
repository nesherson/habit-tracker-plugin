import { useMemo, useState } from 'react';
import { Toolbar } from './toolbar/Toolbar';
import { Tracker } from './tracker/Tracker';
import { getStartOfWeek } from '@/helpers';
import { HabitTrackerContext } from '@/context/habitTrackerContext';
import HabitTracker from '@/main';
import { useHabits } from '@/store/useHabits';

interface AppProps {
	plugin: HabitTracker;
}

export function App({ plugin }: AppProps) {
	const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));

	const handleStartOfWeekChange = (newDate: Date) => {
		setStartOfWeek(getStartOfWeek(newDate));
	};

	const habits = useHabits(plugin.habitStore);

	const ctx = useMemo(() => ({ app: plugin.app, plugin }), [plugin]);

	return (
		<HabitTrackerContext.Provider value={ctx}>
			<div className="ht-root">
				<Toolbar
					startOfWeek={startOfWeek}
					startOfWeekOnChange={handleStartOfWeekChange}
					habits={habits}
				/>
				<div className="ht-body">
					<div className="ht-main">
						<Tracker
							startOfWeek={startOfWeek}
							// habits={state.habits}
							habits={habits}
						/>
					</div>
					{/*<Side
						focuses={state.focuses}
						todos={state.todos}
						readings={state.readings}
						notes={state.notes}
					/>*/}
				</div>
			</div>
		</HabitTrackerContext.Provider>
	);
}
