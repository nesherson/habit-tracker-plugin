import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T = string> {
	label: string;
	value: T;
}

interface DropdownProps<T = string> {
	options: DropdownOption<T>[];
	value: T | null;
	onChange: (value: T) => void;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
}

export function Dropdown<T = string>({
	options,
	value,
	onChange,
	label,
	placeholder = 'Select an option',
	disabled = false,
	required,
}: DropdownProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const selected = options.find((o) => o.value === value) ?? null;

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		activeDocument.addEventListener('mousedown', handleClickOutside);
		return () =>
			activeDocument.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Close on Escape
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false);
		};
		activeDocument.addEventListener('keydown', handleKeyDown);
		return () =>
			activeDocument.removeEventListener('keydown', handleKeyDown);
	}, []);

	const handleSelect = (option: DropdownOption<T>) => {
		onChange(option.value);
		setIsOpen(false);
	};

	return (
		<div className="ht-dropdown-wrapper" ref={containerRef}>
			{label && (
				<label className="ht-dropdown-label">
					{label}
					{required && ' *'}
				</label>
			)}
			<button
				type="button"
				className={`ht-dropdown-trigger ${isOpen ? 'ht-dropdown-trigger--open' : ''} ${disabled ? 'ht-dropdown-trigger--disabled' : ''}`}
				onClick={() => !disabled && setIsOpen((prev) => !prev)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				disabled={disabled}
			>
				<span className={selected ? '' : 'ht-dropdown-placeholder'}>
					{selected ? selected.label : placeholder}
				</span>
				<ChevronDown
					size={16}
					className={`ht-dropdown-chevron ${isOpen ? 'ht-dropdown-chevron--open' : ''}`}
				/>
			</button>

			{isOpen && (
				<ul className="ht-dropdown-menu" role="listbox">
					{options.map((option) => {
						const isSelected = option.value === value;
						return (
							<li
								key={String(option.value)}
								role="option"
								aria-selected={isSelected}
								className={`ht-dropdown-option ${isSelected ? 'ht-dropdown-option--selected' : ''}`}
								onClick={() => handleSelect(option)}
							>
								<span>{option.label}</span>
								{isSelected && <Check size={14} />}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
