import { ChangeEvent, useState } from 'react';

import Modal from './ui/modal/Modal';
import { Habit } from '../types';
import { uid } from '../helpers';
import { seedLog } from '../data';
import { useHabit } from '../context/habitTrackerContext';
import { ColorPicker } from './ui/form/colorPicker/ColorPicker';
import { Input } from './ui/form/input/Input';

interface FormState {
	name: string;
	color: string;
	type: string;
	goal: number;
	unit: string;
}

const initialState: FormState = {
	name: '',
	color: '',
	type: '',
	goal: 1,
	unit: '',
};

interface AddHabitModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function AddHabitModal({ isOpen, onClose }: AddHabitModalProps) {
	const { dispatch } = useHabit();

	const [form, setForm] = useState(initialState);
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
			form.type === '' ||
			form.goal === 0
		) {
			setError('Please enter required values');

			return;
		}

		setError(null);

		const newHabit: Habit = {
			id: uid(),
			name: form.name,
			color: form.color,
			type: form.type,
			goal: form.goal,
			unit: form.unit,
			log: seedLog([0, 0, 0, 0, 0, 0, 0]),
		};

		dispatch({
			type: 'ADD_HABIT',
			payload: newHabit,
		});
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Add new habit"
			footer={
				<>
					<button onClick={onClose}>Cancel</button>
					<button onClick={handleSave}>Save</button>
				</>
			}
		>
			<div className="ht-add-habit-form">
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
				<Input
					name="type"
					label="Type"
					placeholder="Enter type"
					value={form.type}
					onChange={handleChange}
					required
				/>
				<Input
					name="unit"
					label="Unit"
					placeholder="Enter unit"
					value={form.unit}
					onChange={handleChange}
				/>
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
