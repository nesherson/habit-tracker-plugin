import { Plugin, WorkspaceLeaf } from 'obsidian';

import { HabitTrackerSettingTab } from './settings';
import {
	HABIT_TRACKER_VIEW_TYPE,
	HabitTrackerView,
} from './views/HabitTrackerView';
import { PluginData } from './types';
import { defaultPluginData } from './data';

export default class HabitTracker extends Plugin {
	data: PluginData = defaultPluginData;

	async onload() {
		const saved = (await this.loadData()) as PluginData;

		if (saved) {
			this.data = saved;
		}

		this.registerView(
			HABIT_TRACKER_VIEW_TYPE,
			(leaf) => new HabitTrackerView(leaf, this),
		);

		this.addRibbonIcon('dice', 'Sample', async (_evt: MouseEvent) => {
			await this.activateView();
		});

		this.addSettingTab(new HabitTrackerSettingTab(this.app, this));
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
}
