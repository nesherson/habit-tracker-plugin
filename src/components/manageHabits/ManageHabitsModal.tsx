import { useHabitTrackerContext } from '@/context/habitTrackerContext';
import Modal from '../ui/modal/Modal';
import { HabitList } from './HabitList';
import { Habit } from '@/types/habitTrackerTypes';
import { useState } from 'react';
import { EditHabitForm, HabitFields } from './EditHabitForm';
import { uid } from '@/helpers';

export interface ManageHabitsModalProps {
	habits: Habit[];
	isOpen: boolean;
	onClose: () => void;
}

type View = { kind: 'list' } | { kind: 'form'; habit: Habit | null };

export function ManageHabitsModal({
	habits,
	isOpen,
	onClose,
}: ManageHabitsModalProps) {
	const { store } = useHabitTrackerContext();

	const [view, setView] = useState<View>({ kind: 'list' });

	const handleSave = (fields: HabitFields) => {
		if (view.kind !== 'form') return;

		if (view.habit) {
			store.habits.update(view.habit.id, fields);
		} else {
			store.habits.add({
				id: uid(),
				...fields,
				log: {},
			});
		}
		setView({ kind: 'list' });
	};

	const handleOnDelete = (habit: Habit) => {
		store.habits.remove(habit.id);
	};

	const handleClose = () => {
		setView({ kind: 'list' });
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={
				view.kind === 'list'
					? 'Manage habits'
					: view.habit
						? 'Edit habit'
						: 'Add habit'
			}
		>
			{view.kind === 'form' ? (
				<EditHabitForm
					habit={view.habit}
					onSave={handleSave}
					onCancel={() => setView({ kind: 'list' })}
				/>
			) : (
				<>
					<div className="ht-habit-list-buttons">
						<button
							className="ht-btn-primary"
							onClick={() =>
								setView({ kind: 'form', habit: null })
							}
						>
							Add new
						</button>
					</div>
					<HabitList
						habits={habits}
						onEdit={(habit) => setView({ kind: 'form', habit })}
						onDelete={handleOnDelete}
					/>
				</>
			)}
		</Modal>
	);
}
