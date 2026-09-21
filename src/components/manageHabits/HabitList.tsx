import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Habit, HabitType } from '@/types/habitTrackerTypes';

interface HabitListProps {
	habits: Habit[];
	onEdit: (habit: Habit) => void;
	onDelete: (habit: Habit) => void;
}

const TYPE_LABELS: Record<HabitType, string> = {
	check: 'Check',
	num: 'Number',
};

function goalLabel(habit: Habit) {
	return habit.unit ? `${habit.goal} ${habit.unit}` : String(habit.goal);
}

export function HabitList({ habits, onEdit, onDelete }: HabitListProps) {
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(
		null,
	);

	const handleDeleteConfirm = (habit: Habit) => {
		setConfirmDeleteId(null);
		onDelete(habit);
	};

	return (
		<table className="ht-habit-list-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Goal</th>
					<th className="ht-habit-list-actions-col" aria-label="Actions" />
				</tr>
			</thead>
			<tbody>
				{habits.length === 0 && (
					<tr>
						<td colSpan={4} className="ht-habit-list-empty">
							No habits yet
						</td>
					</tr>
				)}
				{habits.map((habit) => {
					const isConfirming = confirmDeleteId === habit.id;

					return (
						<tr
							key={habit.id}
							className={`ht-habit-list-row ${isConfirming ? 'is-confirming' : ''}`}
						>
							<td className="ht-habit-list-name">
								<div className="ht-habit-list-name-inner">
									<span
										className="ht-habit-list-dot"
										style={{ background: habit.color }}
									/>
									<span className="ht-habit-list-name-text">
										{habit.name}
									</span>
								</div>
							</td>
							<td>
								<span
									className={`ht-lozenge ht-lozenge--${habit.type}`}
								>
									{TYPE_LABELS[habit.type]}
								</span>
							</td>
							<td className="ht-habit-list-goal">
								{goalLabel(habit)}
							</td>
							<td className="ht-habit-list-actions-col">
								<div className="ht-habit-list-actions">
									{isConfirming ? (
										<>
											<button
												className="ht-habit-list-btn ht-habit-list-btn--danger"
												onClick={() =>
													handleDeleteConfirm(habit)
												}
											>
												Delete
											</button>
											<button
												className="ht-habit-list-btn"
												onClick={() =>
													setConfirmDeleteId(null)
												}
											>
												Cancel
											</button>
										</>
									) : (
										<>
											<button
												className="ht-habit-list-iconbtn"
												title="Edit"
												aria-label={`Edit ${habit.name}`}
												onClick={() => onEdit(habit)}
											>
												<Pencil size={14} />
											</button>
											<button
												className="ht-habit-list-iconbtn"
												title="Delete"
												aria-label={`Delete ${habit.name}`}
												onClick={() =>
													setConfirmDeleteId(habit.id)
												}
											>
												<Trash2 size={14} />
											</button>
										</>
									)}
								</div>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
