import { HabitTrackerState } from '../types';
import { Toolbar } from './Toolbar';

interface ReactViewProps {
	state: HabitTrackerState;
}

export function ReactView({ state }: ReactViewProps) {
	return (
		<h4>
			<Toolbar startOfWeekInitial={new Date()} habits={state.habits} />
			{state.habits.map((h) => (
				<div>{h.name}</div>
			))}
		</h4>
	);
}
