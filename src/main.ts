import { Plugin, WorkspaceLeaf } from 'obsidian';

import { HabitTrackerSettingTab } from './settings';
import {
	HABIT_TRACKER_VIEW_TYPE,
	HabitTrackerView,
} from './views/HabitTrackerView';
import { PluginData } from './types/habitTrackerTypes';
import { defaultPluginData } from './data';
import { HabitTrackerStore } from './store/habitTrackerStore';

const SAVE_DEBOUNCE_MS = 500;

export default class HabitTracker extends Plugin {
	data: PluginData = defaultPluginData;
	store = new HabitTrackerStore();

	private saveTimer: number | null = null;

	async onload() {
		const saved = (await this.loadData()) as PluginData | null;

		if (saved) {
			this.data = saved;
		}

		this.store.load(this.data.state);
		this.store.onChange(() => this.scheduleSave());

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
			id: 'open',
			name: 'Open',
			callback: () => void this.activateView(),
		});

		this.addSettingTab(new HabitTrackerSettingTab(this.app, this));
	}

	onunload() {
		if (this.saveTimer !== null) {
			window.clearTimeout(this.saveTimer);
			void this.flushSave();
		}
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

		await this.savePluginData({ state: this.store.toState() });
	}
}
