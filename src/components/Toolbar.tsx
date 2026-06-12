import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { addDays, dateKey, weekRate } from '../helpers';
import { WEEK_DAYS } from '../data';
import { Habit } from '../types';

interface ToolbarProps {
	startOfWeekInitial: Date;
	habits: Habit[];
}

export function Toolbar({ startOfWeekInitial, habits }: ToolbarProps) {
	const [startOfWeek, setStartOfWeek] = useState(startOfWeekInitial);

	const handleLeftNavBtnClick = () => {
		setStartOfWeek((prev) => addDays(prev, -7));
	};

	const handleRightNavBtnClick = () => {
		setStartOfWeek((prev) => addDays(prev, 7));
	};

	const handleTodayBtnClick = () => {
		setStartOfWeek(new Date());
	};

	const getWeekDays = () => {
		return WEEK_DAYS.map((_, i) => addDays(startOfWeek, i));
	};

	const label = useMemo(() => {
		const days = getWeekDays();
		const start = days[0]!;
		const end = days[6]!;
		const sameMonth = start.getMonth() === end.getMonth();
		const moOpt = {
			month: sameMonth ? 'long' : 'short',
		} as Intl.DateTimeFormatOptions;
		const label = sameMonth
			? `${start.toLocaleString('en', { month: 'long' })} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`
			: `${start.toLocaleString('en', moOpt)} ${start.getDate()} – ${end.toLocaleString('en', moOpt)} ${end.getDate()}, ${end.getFullYear()}`;

		return label;
	}, []);

	const pct = useMemo(() => {
		const allDays = getWeekDays();
		const todayKey = dateKey(new Date());
		let doneCells = 0,
			totalCells = 0;

		habits.forEach((h) => {
			const r = weekRate(h, allDays, todayKey);

			doneCells += r.score;
			totalCells += r.denom;
		});
		return totalCells ? Math.round((doneCells / totalCells) * 100) : 0;
	}, []);

	return (
		<div className="ht-toolbar">
			<div className="ht-weeknav">
				<button className="ht-navbtn" onClick={handleLeftNavBtnClick}>
					<ChevronLeft size={12} />
				</button>
				<div className="ht-weeklabel">{label}</div>
				<button className="ht-navbtn" onClick={handleRightNavBtnClick}>
					<ChevronRight size={12} />
				</button>
				<button className="ht-todaybtn" onClick={handleTodayBtnClick}>
					This week
				</button>
			</div>
			<div className="ht-toolbar-sum">
				<span className="ht-toolbar-pct">{pct}</span>
				<span className="ht-toolbar-cap">week complete</span>
			</div>
		</div>
	);
}
