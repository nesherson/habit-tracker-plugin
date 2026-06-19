import { FileText, Plus, SquareArrowOutDownLeft, X } from 'lucide-react';

import { ChangeEvent } from 'react';

import { Note } from '../../../types';

interface NotesProps {
	notes: Note[];
	onClick: (note: Note) => void;
	onAdd: () => Promise<void>;
	onDelete: (note: Note) => Promise<void>;
	editItemId: string | null;
	editText: string;
	onEditTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onEditTextBlur: (path: string) => Promise<void>;
	onOpenNote: (note: Note) => Promise<void>;
}

export function Notes({
	notes,
	onClick,
	onAdd,
	onDelete,
	editItemId,
	editText,
	onEditTextChange,
	onEditTextBlur,
	onOpenNote,
}: NotesProps) {
	return (
		<div className="ht-sec">
			<div className="ht-sh">
				<FileText className="ht-sh-icon" size={12} />
				<span className="ht-sh-title">Notes</span>
				{notes.length > 0 && (
					<span className="ht-sh-count">{notes.length}</span>
				)}
				<button className="ht-sh-add" onClick={() => void onAdd()}>
					<Plus size={8} />
				</button>
			</div>
			<div className="ht-noteslist">
				{notes.map((note) => {
					return (
						<div key={note.path} className="ht-noterow">
							<div className="ht-noterow-left">
								<span className="ht-note-icon">
									<FileText size={8} />
								</span>
								<div className="ht-note-1">
									{editItemId === note.path ? (
										<input
											className="ht-edit-text-input"
											value={editText}
											onChange={onEditTextChange}
											onBlur={() =>
												void onEditTextBlur(note.path)
											}
										/>
									) : (
										<span
											className="ht-edit-label"
											onClick={() => onClick(note)}
										>
											{note.label}
										</span>
									)}
								</div>
							</div>
							<div className="ht-option-buttons">
								<button
									className="ht-rowdel ht-rowdel-sm"
									onClick={() => void onOpenNote(note)}
								>
									<SquareArrowOutDownLeft size={8} />
								</button>
								<button
									className="ht-rowdel ht-rowdel-sm"
									onClick={() => void onDelete(note)}
								>
									<X size={8} />
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
