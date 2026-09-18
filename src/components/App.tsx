import { useMemo, useState } from 'react';
import { Toolbar } from './toolbar/Toolbar';
import { Tracker } from './tracker/Tracker';
import { Side } from './side/Side';
import { getStartOfWeek } from '@/helpers';
import { HabitTrackerContext } from '@/context/habitTrackerContext';
import HabitTracker from '@/main';
import { useStore } from '@/store/useStore';

interface AppProps {
	plugin: HabitTracker;
}

export function App({ plugin }: AppProps) {
	const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));

	const habits = useStore(plugin.store.habits);

	const handleStartOfWeekChange = (newDate: Date) => {
		setStartOfWeek(getStartOfWeek(newDate));
	};

	const ctx = useMemo(
		() => ({ app: plugin.app, plugin, store: plugin.store }),
		[plugin],
	);

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
						<Tracker startOfWeek={startOfWeek} habits={habits} />
					</div>
					<Side />
				</div>
			</div>
		</HabitTrackerContext.Provider>
	);
}
