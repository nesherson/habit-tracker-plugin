import { ChangeEvent, useState } from 'react';
import { Check, X } from 'lucide-react';

import { Habit } from '@/types/habitTrackerTypes';
import { useHabitTrackerContext } from '@/context/habitTrackerContext';
import { dateKey, isDone } from '@/helpers';

interface HabitCellProps {
	habit: Habit;
	date: Date;
	todayKey: string;
	color: string;
}

export function HabitCell({ habit, date, todayKey, color }: HabitCellProps) {
	const { dispatch } = useHabitTrackerContext();

	const [editItemId, setEditItemId] = useState<string | null>(null);
	const [editNumber, setEditNumber] = useState<number | undefined>(
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
				value: editNumber ?? 0,
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
