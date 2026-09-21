import { ChangeEvent, useEffect, useState } from 'react';

import { Habit, HabitType, HabitUnit } from '@/types/habitTrackerTypes';
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

export type HabitFields = Omit<Habit, 'id' | 'log'>;

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

interface EditHabitFormProps {
	habit: Habit | null;
	onSave: (fields: HabitFields) => void;
	onCancel: () => void;
}

export function EditHabitForm({ habit, onSave, onCancel }: EditHabitFormProps) {
	const [form, setForm] = useState(() => getInitialState(habit));
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

		const fields: HabitFields = {
			name: form.name,
			color: form.color,
			type: form.type,
			goal: form.goal,
			unit: form.unit,
		};

		setForm(initialState);
		onSave(fields);
	};

	return (
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
				onChange={(hex) => setForm((prev) => ({ ...prev, color: hex }))}
				required
			/>
			<Dropdown
				label="Type"
				placeholder="Select habit type"
				options={typeOptions}
				value={form.type}
				onChange={(val) => setForm((prev) => ({ ...prev, type: val }))}
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
				type='number'
				min={1}
				label="Goal"
				placeholder="Enter goal"
				value={form.goal}
				onChange={handleChange}
				required
			/>
			{error && <span className="ht-validation-error">{error}</span>}
			<button onClick={onCancel}>Cancel</button>
			<button className="ht-btn-primary" onClick={handleSave}>
				Save
			</button>
		</div>
	);
}
