import { WEEK_DAYS } from '@/data';
import { addDays, dateKey } from '@/helpers';
import { Habit } from '@/types/habitTrackerTypes';

import { HabitRow } from './components';

interface TrackerProps {
	startOfWeek: Date;
	habits: Habit[];
}

export function Tracker({ startOfWeek, habits }: TrackerProps) {
	const getWeekDays = () => {
		return WEEK_DAYS.map((_, i) => addDays(startOfWeek, i));
	};

	const days = getWeekDays();
	const todayKey = dateKey(new Date());

	return (
		<div className="htrack">
			<div className="ht-head">
				<div className="ht-corner">
					<span>Habit</span>
				</div>

				{days.map((d) => {
					return (
						<div
							key={d.toString()}
							className={`ht-dayh ${dateKey(d) === todayKey ? 'is-today' : ''}`}
						>
							<span className="ht-wd">
								{WEEK_DAYS[(d.getDay() + 6) % 7]}
							</span>
							<span className="ht-dn">{String(d.getDate())}</span>
						</div>
					);
				})}
				<div className="ht-sumh">Rate</div>
			</div>
			<div className="ht-body-rows">
				{habits.map((h) => (
					<HabitRow
						key={h.id}
						habit={h}
						days={days}
						todayKey={todayKey}
					/>
				))}
			</div>
		</div>
	);
}
