import { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'onChange'
> {
	label?: string;
	icon?: ReactNode;
	maxLength?: number;
	showCount?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
	label,
	icon,
	maxLength,
	showCount = false,
	value = '',
	onChange,
	placeholder,
	type = 'text',
	...rest
}: InputProps) {
	const currentLength = String(value).length;

	return (
		<div className="ht-input-wrapper">
			{label && (
				<label className="ht-input-label">
					{label}
					{rest.required && ' *'}
				</label>
			)}
			<div className="ht-input-field">
				{icon && <span className="ht-input-icon">{icon}</span>}
				<input
					type={type}
					className={`ht-input ${icon ? 'ht-input--with-icon' : ''}`}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					maxLength={maxLength}
					{...rest}
				/>
				{showCount && maxLength && (
					<span className="ht-input-count">
						{currentLength}/{maxLength}
					</span>
				)}
			</div>
		</div>
	);
}
