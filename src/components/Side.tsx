import { Focus, Plus, X } from 'lucide-react';
import { KeyFocus } from '../types';
import { HabitTrackerAction } from '../reducer';
import { uid } from '../helpers';

interface SideProps {
	focuses: KeyFocus[];
	dispatch: React.ActionDispatch<[action: HabitTrackerAction]>;
}

export function Side({ focuses, dispatch }: SideProps) {
	const handleAddFocus = () => {
		dispatch({
			type: 'ADD_FOCUS',
			payload: {
				id: uid(),
				label: 'New focus',
				done: 0,
				total: 2,
			},
		});
	};

	const handleAdvanceFocus = (focus: KeyFocus) => {
		dispatch({
			type: 'UPDATE_FOCUS',
			payload: {
				id: focus.id,
				done: (focus.done + 1) % (focus.total + 1),
			},
		});
	};

	const handleDeleteFocus = (focus: KeyFocus) => {
		dispatch({
			type: 'REMOVE_FOCUS',
			payload: {
				id: focus.id,
			},
		});
	};

	return (
		<div className="ht-side">
			<div className="ht-sec">
				<div className="ht-sh">
					<Focus className="ht-sh-icon" size={12} />
					<span className="ht-sh-title">Key focuses</span>
					{focuses.length > 0 && (
						<span className="ht-sh-count">{focuses.length}</span>
					)}
					<button className="ht-sh-add" onClick={handleAddFocus}>
						<Plus size={8} />
					</button>
				</div>
			</div>
			<div className="ht-focuslist">
				{focuses.map((f) => {
					return (
						<div className="ht-focus">
							<span className="ht-focus-dot"></span>
							<div className="ht-focus-l">
								<span className="ht-edit-label">{f.label}</span>
							</div>
							<span
								className="ht-focus-p"
								aria-label="Click to advance"
								onClick={() => handleAdvanceFocus(f)}
							>
								{`${f.done}/${f.total}`}
							</span>
							<button
								className="ht-rowdel ht-rowdel-sm"
								onClick={() => handleDeleteFocus(f)}
							>
								<X size={8} />
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
