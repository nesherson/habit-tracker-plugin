import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';

import { addDays, getStartOfWeek } from '@/helpers';
import { WEEK_DAYS } from '@/data';
import { Habit } from '@/types/habitTrackerTypes';
import { ManageHabitsModal } from '../manageHabits/ManageHabitsModal';

interface ToolbarProps {
	startOfWeek: Date;
	habits: Habit[];
	startOfWeekOnChange: (newDate: Date) => void;
}

export function Toolbar({
	startOfWeek,
	habits,
	startOfWeekOnChange,
}: ToolbarProps) {
	const [isManageHabitsModalOpen, setIsManageHabitsModalOpen] =
		useState(false);

	const handleLeftNavBtnClick = () => {
		startOfWeekOnChange(addDays(startOfWeek, -7));
	};

	const handleRightNavBtnClick = () => {
		startOfWeekOnChange(addDays(startOfWeek, 7));
	};

	const handleThisWeekClick = () => {
		startOfWeekOnChange(getStartOfWeek(new Date()));
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
	}, [startOfWeek]);

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
				<button className="ht-todaybtn" onClick={handleThisWeekClick}>
					This week
				</button>
				<button
					className="ht-todaybtn"
					onClick={() => setIsManageHabitsModalOpen(true)}
				>
					<Settings size={12} />
				</button>
			</div>

			<ManageHabitsModal
				habits={habits}
				isOpen={isManageHabitsModalOpen}
				onClose={() => setIsManageHabitsModalOpen(false)}
			/>
		</div>
	);
}
