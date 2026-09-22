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
	const { store } = useHabitTrackerContext();

	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState('');

	const key = dateKey(date);
	const v = habit.log[key];
	const done = isDone(habit, v);

	let containerClassName = `ht-cell ${key === todayKey ? 'is-today' : ''}`;

	if (habit.type === 'num') {
		containerClassName += ' ht-cell-num';
	}

	const handleOnClick = () => {
		if (habit.type === 'num') {
			if (isEditing) return;

			setDraft(v != null ? String(v) : '');
			setIsEditing(true);

			return;
		}

		store.habits.updateLog(habit.id, date, done ? 0 : 1);
	};

	const handleDraftChange = (e: ChangeEvent<HTMLInputElement>) => {
		setDraft(e.target.value);
	};

	const handleDraftBlur = () => {
		setIsEditing(false);
		store.habits.updateLog(habit.id, date, Number(draft) || 0);
	};

	return (
		<div className={containerClassName} onClick={handleOnClick}>
			{habit.type === 'num' ? (
				<>
					{isEditing ? (
						<input
							autoFocus
							type="number"
							min={0}
							className="ht-edit-text-input sm"
							value={draft}
							onChange={handleDraftChange}
							onBlur={handleDraftBlur}
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
