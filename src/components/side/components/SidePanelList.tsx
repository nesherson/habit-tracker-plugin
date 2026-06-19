import { Check, LucideIcon, Plus, X } from 'lucide-react';
import { MouseEvent, ChangeEvent } from 'react';

import { ToDo, Reading } from '../../../types';

interface SidePanelListProps {
	title: string;
	icon: LucideIcon;
	items: ToDo[] | Reading[];
	editItemId: string | null;
	editText: string;
	onItemCheck: (e: MouseEvent<HTMLSpanElement>, item: ToDo | Reading) => void;
	onItemClick: (item: { id: string; label: string }) => void;
	onAdd: () => void;
	onDelete: ({ id }: { id: string }) => void;
	onEditTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onEditTextBlur: (id: string) => void;
}

export function SidePanelList({
	title,
	icon: Icon,
	items,
	onItemCheck,
	onItemClick,
	onAdd,
	onDelete,
	editItemId,
	editText,
	onEditTextChange,
	onEditTextBlur,
}: SidePanelListProps) {
	return (
		<div className="ht-sec">
			<div className="ht-sh">
				<Icon className="ht-sh-icon" size={12} />
				<span className="ht-sh-title">{title}</span>
				{items.length > 0 && (
					<span className="ht-sh-count">{items.length}</span>
				)}
				<button className="ht-sh-add" onClick={onAdd}>
					<Plus size={8} />
				</button>
			</div>
			<div className="ht-tasklist">
				{items.map((item) => {
					return (
						<div
							key={item.id}
							className="ht-task"
							onClick={() => onItemClick(item)}
						>
							<div className="ht-task-left">
								<span
									className={`ht-cb ${item.done ? 'is-done' : ''}`}
									onClick={(e) => onItemCheck(e, item)}
								>
									{item.done && <Check size={8} />}
								</span>
								<div
									className={`ht-task-1 ${item.done ? 'is-done' : ''}`}
								>
									{editItemId === item.id ? (
										<input
											className="ht-edit-text-input"
											value={editText}
											onChange={onEditTextChange}
											onBlur={() =>
												onEditTextBlur(item.id)
											}
										/>
									) : (
										<span className="ht-edit-label">
											{item.label}
										</span>
									)}
								</div>
							</div>
							<button
								className="ht-rowdel ht-rowdel-sm"
								onClick={() => onDelete(item)}
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
