import { seedLog, WEEK_DAYS } from '../data';
import { addDays, dateKey, isDone, streak, uid, weekRate } from '../helpers';
import { HabitTrackerAction } from '../reducer';
import { Habit } from '../types';
import { Ring } from './Ring';
import { Check, X, Flame, Plus } from 'lucide-react';

/* per-habit accent palette (works on light & dark themes) */
const PALETTE: Record<string, string> = {
	violet: '#7c6cdf',
	blue: '#4b86d8',
	teal: '#2aa39a',
	green: '#3fa35f',
	amber: '#d2922f',
	rose: '#d2647a',
};

const PALETTE_KEYS = Object.keys(PALETTE);

interface TrackerProps {
	startOfWeek: Date;
	habits: Habit[];
	dispatch: React.ActionDispatch<[action: HabitTrackerAction]>;
}

export function Tracker({ startOfWeek, habits, dispatch }: TrackerProps) {
	const getWeekDays = () => {
		return WEEK_DAYS.map((_, i) => addDays(startOfWeek, i));
	};

	const days = getWeekDays();
	const todayKey = dateKey(new Date());

	function handleAddHabitClick(): void {
		dispatch({
			type: 'ADD_HABIT',
			payload: {
				id: uid(),
				name: 'Test',
				color: '',
				type: '',
				goal: 0,
				unit: '',
				log: seedLog([1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0]),
			},
		});
	}

	return (
		<div className="htrack">
			<div className="ht-head">
				<div className="ht-corner">Habit</div>
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
						dispatch={dispatch}
					/>
				))}
			</div>
			<div className="ht-foot">
				<button className="ht-addhabit" onClick={handleAddHabitClick}>
					<Plus size={12} />
					New Habit
				</button>
			</div>
		</div>
	);
}

interface HabitRowProps {
	habit: Habit;
	days: Date[];
	todayKey: string;
	dispatch: React.ActionDispatch<[action: HabitTrackerAction]>;
}

function HabitRow({ habit, days, todayKey, dispatch }: HabitRowProps) {
	const color = PALETTE[habit.color] || PALETTE.violet!;
	const rate = weekRate(habit, days);
	const st = streak(habit);

	return (
		<div className="ht-row">
			<div className="ht-name">
				<Ring pct={rate.score / rate.denom} color={color} size={20} />
				<span
					style={{ color: color }}
					className="ht-edit-label ht-habit-name"
				>
					{habit.name}
					{habit.type === 'num' && (
						<span className="ht-goaltag">
							{`${habit.goal}${habit.unit || ''}`}
						</span>
					)}
				</span>
			</div>
			{days.map((d) => (
				<HabitCell
					key={`${habit.id}-${d.toString()}`}
					habit={habit}
					date={d}
					todayKey={todayKey}
					color={color}
					dispatch={dispatch}
				/>
			))}
			<div className="ht-sumc">
				<span className="ht-rate" style={{ color: color }}>
					{rate.pct}%
					{st >= 1 && (
						<span
							className="ht-streak"
							title={`Streak of ${st} ${st === 1 ? 'week' : 'weeks'}`}
						>
							<Flame size={8} />
							{st}
						</span>
					)}
				</span>
			</div>
		</div>
	);
}

interface HabitCellProps {
	habit: Habit;
	date: Date;
	todayKey: string;
	color: string;
	dispatch: React.ActionDispatch<[action: HabitTrackerAction]>;
}

function HabitCell({ habit, date, todayKey, color, dispatch }: HabitCellProps) {
	const key = dateKey(date);
	const v = habit.log[key];
	const done = isDone(habit, v);

	const containerClassName = `ht-cell ${key === todayKey ? 'is-today' : ''}`;

	if (habit.type === 'num') {
		containerClassName.concat(' ht-cell-num');
	}

	const handleOnClick = () => {
		dispatch({
			type: 'UPDATE_HABIT_LOG',
			payload: {
				id: habit.id,
				key: key,
				value: done ? 0 : 1,
			},
		});
	};

	return (
		<div className={containerClassName} onClick={handleOnClick}>
			{habit.type === 'num' ? (
				<>
					<span
						style={{ color: done ? color : 'initial' }}
						className={`ht-numval ${done ? 'is-met' : ''}`}
					>
						{v != null ? String(v) : '0'}
					</span>
					<span className="ht-numunit">{habit.unit}</span>
				</>
			) : (
				<>
					<span
						style={{ color: done ? color : 'initial' }}
						className={`ht-mark ${done ? 'is-on' : 'is-off'}`}
					>
						{done ? <Check size={12} /> : <X size={12} />}
					</span>
				</>
			)}
		</div>
	);
}
