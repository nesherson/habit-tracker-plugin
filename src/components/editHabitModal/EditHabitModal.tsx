import { ChangeEvent, useEffect, useState } from 'react';

import Modal from '@/components/ui/modal/Modal';
import { Habit, HabitType, HabitUnit } from '@/types/habitTrackerTypes';
import { uid } from '@/helpers';
import { seedLog } from '@/data';
import { useHabitTrackerContext } from '@/context/habitTrackerContext';
import { ColorPicker } from '@/components/ui/form/colorPicker/ColorPicker';
import { Input } from '@/components/ui/form/input/Input';
import {
	Dropdown,
	DropdownOption,
} from '@/components/ui/form/dropdown/Dropdown';

interface FormState {
	name: string;
	color: string;
	type: HabitType;
	goal: number;
	unit?: HabitUnit;
}

const initialState: FormState = {
	name: '',
	color: '',
	type: 'check',
	goal: 1,
	unit: undefined,
};

const typeOptions: DropdownOption<HabitType>[] = [
	{ label: 'Check', value: 'check' },
	{ label: 'Number', value: 'num' },
];

const unitOptions: DropdownOption<HabitUnit>[] = [
	{ label: 'Pages', value: 'pg' },
	{ label: 'Miles', value: 'mi' },
];

interface EditHabitModalProps {
	isOpen: boolean;
	onClose: () => void;
	habit: Habit | null;
}

function getInitialState(habit: Habit | null) {
	if (habit) {
		return {
			name: habit.name,
			color: habit.color,
			type: habit.type,
			goal: habit.goal,
			unit: habit.unit,
		};
	}

	return initialState;
}

export function EditHabitModal({
	isOpen,
	onClose,
	habit,
}: EditHabitModalProps) {
	const { dispatch } = useHabitTrackerContext();

	const [form, setForm] = useState(getInitialState(habit));
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;

		setForm((prev) => ({
			...prev,
			[name]: type === 'number' ? Number(value) : value,
		}));
	};

	const handleSave = () => {
		if (
			form.name === '' ||
			form.color === '' ||
			form.goal === 0 ||
			(form.type === 'num' && !form.unit)
		) {
			setError('Please enter required values');

			return;
		}

		setError(null);

		const newHabit: Habit = {
			id: habit?.id ?? uid(),
			name: form.name,
			color: form.color,
			type: form.type,
			goal: form.goal,
			unit: form.unit,
			log: habit?.log ?? seedLog([0, 0, 0, 0, 0, 0, 0]),
		};

		dispatch({
			type: habit === null ? 'ADD_HABIT' : 'UPDATE_HABIT',
			payload: newHabit,
		});
		setForm(initialState);
		onClose();
	};

	const handleClose = () => {
		setForm(initialState);
		setError(null);
		onClose();
	};

	useEffect(() => {
		if (habit) setForm(getInitialState(habit));
	}, [habit]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={`${habit === null ? 'Add new' : 'Edit'} habit`}
			footer={
				<>
					<button onClick={onClose}>Cancel</button>
					<button onClick={handleSave}>Save</button>
				</>
			}
		>
			<div className="ht-edit-habit-form">
				<Input
					name="name"
					label="Name"
					placeholder="Enter habit name"
					value={form.name}
					onChange={handleChange}
					maxLength={60}
					showCount
					required
				/>
				<ColorPicker
					label="Color"
					value={form.color}
					onChange={(hex) =>
						setForm((prev) => ({ ...prev, color: hex }))
					}
					required
				/>
				<Dropdown
					label="Type"
					placeholder="Select habit type"
					options={typeOptions}
					value={form.type}
					onChange={(val) =>
						setForm((prev) => ({ ...prev, type: val }))
					}
					required
				/>
				{form.type === 'num' && (
					<Dropdown
						label="Unit"
						placeholder="Select unit"
						options={unitOptions}
						value={form.unit}
						onChange={(val) =>
							setForm((prev) => ({ ...prev, unit: val }))
						}
						required
					/>
				)}
				<Input
					name="goal"
					label="Goal"
					placeholder="Enter goal"
					value={form.goal}
					onChange={handleChange}
					required
				/>
				{error && <span className="ht-validation-error">{error}</span>}
			</div>
		</Modal>
	);
}
