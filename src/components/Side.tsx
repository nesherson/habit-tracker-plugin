import {
	BookOpen,
	Check,
	FileText,
	Focus,
	ListTodo,
	LucideIcon,
	Pencil,
	Plus,
	SquareArrowOutDownLeft,
	X,
} from 'lucide-react';
import { KeyFocus, ToDo, Reading, Note } from '../types';
import { uid } from '../helpers';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { useHabit } from '../context/habitTrackerContext';
import { HT_NOTES_PATH } from '../constants';
import { TFile } from 'obsidian';

interface SideProps {
	focuses: KeyFocus[];
	todos: ToDo[];
	readings: Reading[];
	notes: Note[];
}

export function Side({ focuses, todos, readings, notes }: SideProps) {
	const { dispatch, app } = useHabit();

	const [editItemId, setEditItemId] = useState<string | null>(null);
	const [editText, setEditText] = useState('');

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

	const handleAdvanceFocus = (
		e: MouseEvent<HTMLSpanElement>,
		focus: KeyFocus,
	) => {
		e.stopPropagation();

		dispatch({
			type: 'UPDATE_FOCUS',
			payload: {
				id: focus.id,
				done: (focus.done + 1) % (focus.total + 1),
			},
		});
	};

	const handleDeleteFocus = (
		e: MouseEvent<HTMLSpanElement>,
		focus: KeyFocus,
	) => {
		e.stopPropagation();
		dispatch({
			type: 'REMOVE_FOCUS',
			payload: {
				id: focus.id,
			},
		});
	};

	const handleItemClick = (item: { id: string; label: string }) => {
		setEditItemId(item.id);
		setEditText(item.label);
	};

	const handleItemAdd = (actionType: 'ADD_TODO' | 'ADD_READING') => {
		dispatch({
			type: actionType,
			payload: {
				id: uid(),
				label: 'New item',
				done: false,
			},
		});
	};

	const handleItemCheck = (
		e: MouseEvent<HTMLSpanElement>,
		actionType: 'TOGGLE_TODO' | 'TOGGLE_READING',
		item: ToDo | Reading,
	) => {
		e.stopPropagation();
		dispatch({
			type: actionType,
			payload: {
				id: item.id,
			},
		});
	};

	const handleItemDelete = (
		actionType: 'REMOVE_TODO' | 'REMOVE_READING',
		id: string,
	) => {
		dispatch({
			type: actionType,
			payload: {
				id: id,
			},
		});
	};

	const handleEditTextChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEditText(e.target.value);
	};

	const handleEditTextBlur = (
		actionType:
			| 'UPDATE_FOCUS'
			| 'UPDATE_TODO'
			| 'UPDATE_READING'
			| 'UPDATE_NOTE',
		id: string,
	) => {
		const text = editText;

		setEditItemId(null);
		setEditText('');
		dispatch({
			type: actionType,
			payload: {
				id: id,
				label: text,
			},
		});
	};

	const handleAddNote = async () => {
		const noteId = uid();
		const noteLabel = 'Untitled note';
		dispatch({
			type: 'ADD_NOTE',
			payload: {
				id: noteId,
				label: noteLabel,
			},
		});

		const path = `${HT_NOTES_PATH}/${noteLabel}.md`;
		const content = `---\nht-id: ${noteId}\n---\n\n#`;

		await app.vault.create(path, content);
	};

	const handleDeleteNote = (noteId: string) => {
		dispatch({
			type: 'REMOVE_NOTE',
			payload: {
				id: noteId,
			},
		});
	};

	const handleOpenNote = async (note: Note) => {
		// const path = `HabitTracker/Notes/${note.label}.md`;
		// const content = `---\nht-id: ${note.id}\n---\n\n# ${note.label}\n`;
		// await app.vault.create(path, content);
		const file = app.vault.getAbstractFileByPath(
			`${HT_NOTES_PATH}/${note.label}.md`,
		) as TFile;

		await app.workspace.getLeaf(false).openFile(file);
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
				<div className="ht-focuslist">
					{focuses.map((f) => {
						return (
							<div
								key={f.id}
								className="ht-focus"
								onClick={() => handleItemClick(f)}
							>
								<span className="ht-focus-dot"></span>
								<div className="ht-focus-l">
									{editItemId === f.id ? (
										<input
											className="ht-edit-text-input"
											value={editText}
											onChange={handleEditTextChange}
											onBlur={() =>
												handleEditTextBlur(
													'UPDATE_FOCUS',
													f.id,
												)
											}
										/>
									) : (
										<span className="ht-edit-label">
											{f.label}
										</span>
									)}
								</div>
								<span
									className="ht-focus-p"
									aria-label="Click to advance"
									onClick={(e) => handleAdvanceFocus(e, f)}
								>
									{`${f.done}/${f.total}`}
								</span>
								<button
									className="ht-rowdel ht-rowdel-sm"
									onClick={(e) => handleDeleteFocus(e, f)}
								>
									<X size={8} />
								</button>
							</div>
						);
					})}
				</div>
			</div>
			<SidePanelList
				title="To-do"
				icon={ListTodo}
				items={todos}
				onItemCheck={(e, item) =>
					handleItemCheck(e, 'TOGGLE_TODO', item)
				}
				onItemClick={handleItemClick}
				onAdd={() => handleItemAdd('ADD_TODO')}
				onDelete={({ id }) => handleItemDelete('REMOVE_TODO', id)}
				editItemId={editItemId}
				editText={editText}
				onEditTextChange={handleEditTextChange}
				onEditTextBlur={(id) => handleEditTextBlur('UPDATE_TODO', id)}
			/>
			<SidePanelList
				title="Read / Watch"
				icon={BookOpen}
				items={readings}
				onItemCheck={(e, item) =>
					handleItemCheck(e, 'TOGGLE_READING', item)
				}
				onItemClick={handleItemClick}
				onAdd={() => handleItemAdd('ADD_READING')}
				onDelete={({ id }) => handleItemDelete('REMOVE_READING', id)}
				editItemId={editItemId}
				editText={editText}
				onEditTextChange={handleEditTextChange}
				onEditTextBlur={(id) =>
					handleEditTextBlur('UPDATE_READING', id)
				}
			/>
			<Notes
				notes={notes}
				onClick={handleItemClick}
				onAdd={handleAddNote}
				onDelete={handleDeleteNote}
				editItemId={editItemId}
				editText={editText}
				onEditTextChange={handleEditTextChange}
				onEditTextBlur={(id) => handleEditTextBlur('UPDATE_NOTE', id)}
				onOpenNote={handleOpenNote}
			/>
		</div>
	);
}

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

function SidePanelList({
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

interface NotesProps {
	notes: Note[];
	onClick: (note: Note) => void;
	onAdd: () => void;
	onDelete: (noteId: string) => void;
	editItemId: string | null;
	editText: string;
	onEditTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onEditTextBlur: (id: string) => void;
	onOpenNote: (note: Note) => void;
}

function Notes({
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
				<button className="ht-sh-add" onClick={onAdd}>
					<Plus size={8} />
				</button>
			</div>
			<div className="ht-noteslist">
				{notes.map((note) => {
					return (
						<div key={note.id} className="ht-noterow">
							<div className="ht-noterow-left">
								<span className="ht-note-icon">
									<FileText size={8} />
								</span>
								<div className="ht-note-1">
									{editItemId === note.id ? (
										<input
											className="ht-edit-text-input"
											value={editText}
											onChange={onEditTextChange}
											onBlur={() =>
												onEditTextBlur(note.id)
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
									onClick={() => onOpenNote(note)}
								>
									<SquareArrowOutDownLeft size={8} />
								</button>
								<button
									className="ht-rowdel ht-rowdel-sm"
									onClick={() => onDelete(note.id)}
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
