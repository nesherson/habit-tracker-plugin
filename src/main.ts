import { Plugin, TFile, TFolder, WorkspaceLeaf } from 'obsidian';
import { ActionDispatch } from 'react';

import { HabitTrackerSettingTab } from './settings';
import {
	HABIT_TRACKER_VIEW_TYPE,
	HabitTrackerView,
} from './views/HabitTrackerView';
import { Note, PluginData } from './types/habitTrackerTypes';
import { defaultPluginData } from './data';
import { HabitTrackerAction } from './store/reducer';
import { HT_NOTES_PATH } from './constants';
import { HabitStore } from './store/habitStore';

const SAVE_DEBOUNCE_MS = 500;

export default class HabitTracker extends Plugin {
	data: PluginData = defaultPluginData;
	dispatch: ActionDispatch<[action: HabitTrackerAction]> | null = null;
	noteIdMap = new Map<string, string>();

	habitStore = new HabitStore();
	private saveTimer: number | null = null;

	async onload() {
		const saved = (await this.loadData()) as PluginData;

		if (saved) {
			this.data = saved;
		}

		this.habitStore.setHabits(this.data.state?.habits ?? []);
		this.habitStore.subscribe(() => this.scheduleSave());

		const folder = this.app.vault.getAbstractFileByPath(HT_NOTES_PATH);

		if (folder instanceof TFolder) {
			for (const file of folder.children) {
				if (file instanceof TFile) {
					this.noteIdMap.set(file.path, file.basename);
				}
			}
		}

		this.registerView(
			HABIT_TRACKER_VIEW_TYPE,
			(leaf) => new HabitTrackerView(leaf, this),
		);

		this.addRibbonIcon(
			'notebook',
			'Habit tracker',
			async (_evt: MouseEvent) => {
				await this.activateView();
			},
		);

		this.addCommand({
			id: 'open-app',
			name: 'Open',
			callback: () => void this.activateView(),
		});

		this.addSettingTab(new HabitTrackerSettingTab(this.app, this));

		this.registerEvent(
			this.app.vault.on('create', async () => {
				await this.syncNotesFromFolder();
			}),
		);

		this.registerEvent(
			this.app.vault.on('rename', async () => {
				await this.syncNotesFromFolder();
			}),
		);

		this.registerEvent(
			this.app.vault.on('delete', async () => {
				await this.syncNotesFromFolder();
			}),
		);
	}

	onunload() {
		if (this.saveTimer !== null) {
			window.clearTimeout(this.saveTimer);
			void this.flushSave();
		}
	}

	private scheduleSave() {
		if (this.saveTimer !== null) {
			window.clearTimeout(this.saveTimer);
		}

		this.saveTimer = window.setTimeout(
			() => void this.flushSave(),
			SAVE_DEBOUNCE_MS,
		);
	}

	private async flushSave() {
		this.saveTimer = null;

		await this.savePluginData({
			state: { habits: this.habitStore.getSnapshot() },
		});
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | undefined = undefined;
		const leaves = workspace.getLeavesOfType(HABIT_TRACKER_VIEW_TYPE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getLeaf(true);
			await leaf.setViewState({
				type: HABIT_TRACKER_VIEW_TYPE,
				active: true,
			});
		}

		if (leaf) {
			await workspace.revealLeaf(leaf);
		}
	}

	async savePluginData(updates: Partial<PluginData>) {
		this.data = { ...this.data, ...updates };

		await this.saveData(this.data);
	}

	async syncNotesFromFolder() {
		const folder = this.app.vault.getAbstractFileByPath(HT_NOTES_PATH);
		if (!(folder instanceof TFolder)) return;

		const notes: Note[] = [];

		for (const child of folder.children) {
			if (!(child instanceof TFile)) continue;

			this.noteIdMap.set(child.path, child.basename);
			notes.push({ path: child.path, label: child.basename });
		}

		this.dispatch?.({ type: 'LOAD_NOTES', payload: notes });
	}
}
