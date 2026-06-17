import { Plugin, TFile, WorkspaceLeaf } from 'obsidian';

import { HabitTrackerSettingTab } from './settings';
import {
	HABIT_TRACKER_VIEW_TYPE,
	HabitTrackerView,
} from './views/HabitTrackerView';
import { PluginData } from './types';
import { defaultPluginData } from './data';
import { HabitTrackerAction } from './reducer';
import { ActionDispatch } from 'react';
import { getNoteId } from './helpers';
import { LucideImageMinus } from 'lucide-react';

const TRACKED_FOLDER = 'HabitTracker/Notes';

export default class HabitTracker extends Plugin {
	data: PluginData = defaultPluginData;
	dispatch: ActionDispatch<[action: HabitTrackerAction]> | null = null;

	async onload() {
		const saved = (await this.loadData()) as PluginData;

		if (saved) {
			this.data = saved;
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

		this.addSettingTab(new HabitTrackerSettingTab(this.app, this));

		this.registerEvent(
			this.app.vault.on('delete', (file) => {
				if (file instanceof TFile) {
					this.handleFileDeleted(file);
				}
			}),
		);
	}

	onunload() {}

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

	handleFileDeleted(file: TFile) {
		if (!file.path.startsWith(TRACKED_FOLDER)) return;

		const id = getNoteId(this.app, file);

		console.log(id);

		if (id && this.dispatch) {
			this.dispatch({
				type: 'REMOVE_NOTE',
				payload: { id: id },
			});
		}
	}
}
