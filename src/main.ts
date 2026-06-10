import { Plugin, WorkspaceLeaf } from 'obsidian';

import { DEFAULT_SETTINGS, Settings, HabitTrackerSettingTab } from './settings';
import {
	HABIT_TRACKER_VIEW_TYPE,
	HabitTrackerView,
} from './views/HabitTrackerView';
import { HabitTrackerState } from './types';
import { seedData } from './data';

export default class HabitTracker extends Plugin {
	settings: Settings | null = null;
	data: HabitTrackerState | null = null;

	async onload() {
		const saved = (await this.loadData()) as HabitTrackerState;

		await this.loadSettings();

		this.data = saved && saved.habits ? saved : seedData();

		this.registerView(
			HABIT_TRACKER_VIEW_TYPE,
			(leaf) => new HabitTrackerView(leaf, this),
		);

		this.addRibbonIcon('dice', 'Sample', (_evt: MouseEvent) => {
			this.activateView();
		});

		this.addSettingTab(new HabitTrackerSettingTab(this.app, this));
	}

	onunload() {}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(HABIT_TRACKER_VIEW_TYPE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getLeaf(true);
			await leaf.setViewState({
				type: HABIT_TRACKER_VIEW_TYPE,
				active: true,
			});
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<Settings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
