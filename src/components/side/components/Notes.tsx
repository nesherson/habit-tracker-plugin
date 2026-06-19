import { FileText, Plus, SquareArrowOutDownLeft, X } from 'lucide-react';

import { ChangeEvent, useState } from 'react';

import { Note } from '@/types/habitTrackerTypes';
import Modal from '@/components/ui/modal/Modal';
import { Notice, TFile } from 'obsidian';
import { useHabitTrackerContext } from '@/context/habitTrackerContext';
import { HT_NOTES_PATH } from '@/constants';

interface NotesProps {
	notes: Note[];
}

export function Notes({ notes }: NotesProps) {
	const { app } = useHabitTrackerContext();

	const [isConfirmDeleteNoteModalOpen, setIsConfirmDeleteNoteModalOpen] =
		useState(false);
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [editItemId, setEditItemId] = useState<string | null>(null);
	const [editText, setEditText] = useState('');

	const handleNoteClick = (item: { path: string; label: string }) => {
		setEditItemId(item.path);
		setEditText(item.label);
	};

	const handleAddNote = async () => {
		const noteLabel = 'Untitled note';
		const path = `${HT_NOTES_PATH}/${noteLabel}.md`;

		try {
			await app.vault.create(path, '');
		} catch (err) {
			if (err instanceof Error) {
				new Notice(
					'A note with that name already exists. Try a different name.',
				);
			}
		}
	};

	const handleOpenNote = async (note: Note) => {
		const file = app.vault.getAbstractFileByPath(
			`${HT_NOTES_PATH}/${note.label}.md`,
		);

		if (!(file instanceof TFile)) return;

		await app.workspace.getLeaf(false).openFile(file);
	};

	const handleShowDeleteNoteModal = (note: Note) => {
		setSelectedNote(note);
		setIsConfirmDeleteNoteModalOpen(true);
	};

	const handleDeleteNote = async () => {
		if (selectedNote === null) return;

		const file = app.vault.getAbstractFileByPath(selectedNote.path);
		if (!file) return;
		try {
			await app.vault.delete(file);
		} catch (err) {
			if (err instanceof Error) {
				new Notice(
					'Could not delete note. The file may have been moved or deleted.',
				);
			}
		}

		setIsConfirmDeleteNoteModalOpen(false);
	};

	const handleEditTextChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEditText(e.target.value);
	};

	const handleEditTextBlur = async (path: string) => {
		const text = editText;
		const file = app.vault.getAbstractFileByPath(path);

		try {
			if (file)
				await app.vault.rename(file, `${file.parent?.path}/${text}.md`);

			setEditItemId(null);
			setEditText('');
		} catch (err) {
			if (err instanceof Error) {
				new Notice(
					'A note with that name already exists. Try a different name.',
				);
			}
		}
	};

	return (
		<div className="ht-sec">
			<div className="ht-sh">
				<FileText className="ht-sh-icon" size={12} />
				<span className="ht-sh-title">Notes</span>
				{notes.length > 0 && (
					<span className="ht-sh-count">{notes.length}</span>
				)}
				<button
					className="ht-sh-add"
					onClick={() => void handleAddNote()}
				>
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
											onChange={handleEditTextChange}
											onBlur={() =>
												void handleEditTextBlur(
													note.path,
												)
											}
										/>
									) : (
										<span
											className="ht-edit-label"
											onClick={() =>
												handleNoteClick(note)
											}
										>
											{note.label}
										</span>
									)}
								</div>
							</div>
							<div className="ht-option-buttons">
								<button
									className="ht-rowdel ht-rowdel-sm"
									onClick={() => void handleOpenNote(note)}
								>
									<SquareArrowOutDownLeft size={8} />
								</button>
								<button
									className="ht-rowdel ht-rowdel-sm"
									onClick={() =>
										handleShowDeleteNoteModal(note)
									}
								>
									<X size={8} />
								</button>
							</div>
						</div>
					);
				})}
			</div>
			<Modal
				isOpen={isConfirmDeleteNoteModalOpen}
				onClose={() => setIsConfirmDeleteNoteModalOpen(false)}
				title="Confirm note deletion"
				footer={
					<>
						<button
							onClick={() =>
								setIsConfirmDeleteNoteModalOpen(false)
							}
						>
							No
						</button>
						<button onClick={() => void handleDeleteNote()}>
							Yes
						</button>
					</>
				}
			>
				<div>Are you sure you want to delete note?</div>
			</Modal>
		</div>
	);
}
