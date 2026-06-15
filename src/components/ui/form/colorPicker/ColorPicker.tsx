import { PALETTE } from '../../../../palette';

interface ColorPickerProps {
	value: string;
	onChange: (color: string) => void;
	label?: string;
	required?: boolean;
}

export function ColorPicker({
	value,
	onChange,
	label = 'Choose Color',
	required,
}: ColorPickerProps) {
	return (
		<div className="ht-color-picker">
			{label && (
				<label className="ht-color-picker__label">
					{label} {required && '*'}
				</label>
			)}
			<div className="ht-color-picker__swatches">
				{Object.entries(PALETTE).map(([name, hex]) => (
					<button
						key={name}
						type="button"
						className={`ht-color-picker__swatch ${value === hex ? 'ht-color-picker__swatch--selected' : ''}`}
						style={{ backgroundColor: hex }}
						onClick={() => onChange(hex)}
						aria-label={name}
						aria-pressed={value === hex}
						title={name}
					/>
				))}
			</div>
		</div>
	);
}
