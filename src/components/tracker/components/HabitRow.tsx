import { Flame, X } from 'lucide-react';

import { Habit } from '../../../types/habitTrackerTypes';
import { weekRate, streak } from '../../../helpers';
import { Ring } from './Ring';
import { HabitCell } from './HabitCell';

interface HabitRowProps {
	habit: Habit;
	days: Date[];
	todayKey: string;
	onFirstCellDoubleClick: (habit: Habit) => void;
	onDeleteBtnClick: (habit: Habit) => void;
}

export function HabitRow({
	habit,
	days,
	todayKey,
	onFirstCellDoubleClick,
	onDeleteBtnClick,
}: HabitRowProps) {
	const rate = weekRate(habit, days);
	const st = streak(habit);

	return (
		<div className="ht-row">
			<div
				onDoubleClick={() => onFirstCellDoubleClick(habit)}
				className="ht-name"
			>
				<Ring
					pct={rate.score / rate.denom}
					color={habit.color}
					size={20}
				/>
				<span
					style={{ color: habit.color }}
					className="ht-edit-label ht-habit-name"
				>
					{habit.name}
					{habit.type === 'num' && (
						<span className="ht-goaltag">
							{`${habit.goal}${habit.unit || ''}`}
						</span>
					)}
				</span>
				<button
					className="ht-rowdel ht-rowdel-sm"
					onClick={() => onDeleteBtnClick(habit)}
				>
					<X size={8} />
				</button>
			</div>
			{days.map((d) => (
				<HabitCell
					key={`${habit.id}-${d.toString()}`}
					habit={habit}
					date={d}
					todayKey={todayKey}
					color={habit.color}
				/>
			))}
			<div className="ht-sumc">
				<span className="ht-rate" style={{ color: habit.color }}>
					{rate.pct}%
					{st >= 1 && (
						<span
							className="ht-streak"
							title={`Streak of ${st} ${st === 1 ? 'week' : 'weeks'}`}
						>
							<Flame size={14} color="#d2922f" />
							{st}
						</span>
					)}
				</span>
			</div>
		</div>
	);
}
