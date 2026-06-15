import { WEEK_DAYS } from '../data';
import { addDays, dateKey, isDone, streak, weekRate } from '../helpers';
import { Habit } from '../types';
import { Ring } from './Ring';
import { Check, X, Plus, Flame, Zap, Crown, Trophy } from 'lucide-react';
import { EditHabitModal } from './EditHabitModal';

import streakFireUrl from '../assets/streak-fire.svg';
import { ChangeEvent, useState } from 'react';
import { useHabit } from '../context/habitTrackerContext';

interface TrackerProps {
	startOfWeek: Date;
	habits: Habit[];
}

export function Tracker({ startOfWeek, habits }: TrackerProps) {
	const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
	const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

	const getWeekDays = () => {
		return WEEK_DAYS.map((_, i) => addDays(startOfWeek, i));
	};

	const days = getWeekDays();
	const todayKey = dateKey(new Date());

	const handleOpenAddHabitModal = () => {
		setSelectedHabit(null);
		setIsAddHabitModalOpen(true);
	};

	const handleFirstCellDoubleClick = (habit: Habit) => {
		setSelectedHabit(habit);
		setIsAddHabitModalOpen(true);
	};

	return (
		<div className="htrack">
			<div className="ht-head">
				<div className="ht-corner">
					<span>Habit</span>
					<button
						className="ht-addhabit"
						title="Add new habit"
						onClick={handleOpenAddHabitModal}
					>
						<Plus size={3} />
					</button>
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
						onFirstCellDoubleClick={handleFirstCellDoubleClick}
					/>
				))}
			</div>
			<EditHabitModal
				isOpen={isAddHabitModalOpen}
				onClose={() => setIsAddHabitModalOpen(false)}
				habit={selectedHabit}
			/>
		</div>
	);
}

interface HabitRowProps {
	habit: Habit;
	days: Date[];
	todayKey: string;
	onFirstCellDoubleClick: (habit: Habit) => void;
}

function HabitRow({
	habit,
	days,
	todayKey,
	onFirstCellDoubleClick,
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
							<Flame size={16} color="#d2922f" />
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
}

function HabitCell({ habit, date, todayKey, color }: HabitCellProps) {
	const { dispatch } = useHabit();

	const [editItemId, setEditItemId] = useState<string | null>(null);
	const [editNumber, setEditNumber] = useState<number>(
		habit.log[dateKey(date)],
	);

	const key = dateKey(date);
	const v = habit.log[key];
	const done = isDone(habit, v);

	const containerClassName = `ht-cell ${key === todayKey ? 'is-today' : ''}`;

	if (habit.type === 'num') {
		containerClassName.concat(' ht-cell-num');
	}

	const handleOnClick = () => {
		if (habit.type === 'num') {
			setEditItemId(habit.id);

			return;
		}

		dispatch({
			type: 'UPDATE_HABIT_LOG',
			payload: {
				id: habit.id,
				key: key,
				value: done ? 0 : 1,
			},
		});
	};

	const handleEditNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEditNumber(Number(e.target.value));
	};

	const handleEditNumberBlur = () => {
		setEditItemId(null);
		dispatch({
			type: 'UPDATE_HABIT_LOG',
			payload: {
				id: habit.id,
				key: key,
				value: editNumber,
			},
		});
	};

	return (
		<div className={containerClassName} onClick={handleOnClick}>
			{habit.type === 'num' ? (
				<>
					{editItemId === habit.id ? (
						<input
							className="ht-edit-text-input sm"
							value={editNumber}
							onChange={handleEditNumberChange}
							onBlur={handleEditNumberBlur}
						/>
					) : (
						<span
							style={{ color: done ? color : 'initial' }}
							className={`ht-numval ${done ? 'is-met' : ''}`}
						>
							{v != null ? String(v) : '0'}
						</span>
					)}
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
