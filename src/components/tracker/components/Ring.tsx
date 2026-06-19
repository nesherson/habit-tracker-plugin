interface RingProps {
	pct: number;
	color: string;
	size: 20;
}

export function Ring({ pct, color, size }: RingProps) {
	const r = 8.5;
	const c = 2 * Math.PI * r;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="ht-ring"
			viewBox="0 0 24 24"
			width={size}
			height={size}
		>
			<circle
				className="ht-ring-bg"
				cx={12}
				cy={12}
				r={r}
				fill="none"
				strokeWidth={3.2}
			/>
			<circle
				cx={12}
				cy={12}
				r={r}
				fill="none"
				stroke={color}
				strokeWidth={3.2}
				strokeLinecap="round"
				strokeDasharray={c.toString()}
				strokeDashoffset={(c * (1 - pct)).toString()}
				transform="rotate(-90 12 12)"
			/>
		</svg>
	);
}
