import { WEEK_DAYS } from '../../data';
import { addDays, dateKey } from '../../helpers';
import { Habit } from '../../types/habitTrackerTypes';
import { Plus } from 'lucide-react';
import { EditHabitModal } from '../EditHabitModal/EditHabitModal';

import { useState } from 'react';
import { useHabitTrackerContext } from '../../context/habitTrackerContext';
import { HabitRow } from './components';

interface TrackerProps {
	startOfWeek: Date;
	habits: Habit[];
}

export function Tracker({ startOfWeek, habits }: TrackerProps) {
	const { dispatch } = useHabitTrackerContext();

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

	const handleDeleteBtnClick = (habit: Habit) => {
		dispatch({
			type: 'REMOVE_HABIT',
			payload: {
				id: habit.id,
			},
		});
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
						onDeleteBtnClick={handleDeleteBtnClick}
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
