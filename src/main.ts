import { Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, Settings, HabitTrackerSettingTab } from './settings';

export default class HabitTracker extends Plugin {
	settings!: Settings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('dice', 'Sample', (_evt: MouseEvent) => {
			new Notice('This is a notice!');
		});

		this.addSettingTab(new HabitTrackerSettingTab(this.app, this));
	}

	onunload() {}

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
