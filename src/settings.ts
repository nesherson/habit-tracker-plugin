import { App, PluginSettingTab, Setting } from 'obsidian';
import HabitTracker from './main';
import { HabitTrackerSettings } from './types';

export const DEFAULT_SETTINGS: HabitTrackerSettings = {
	mySetting: 'default',
};

export class HabitTrackerSettingTab extends PluginSettingTab {
	plugin: HabitTracker;

	constructor(app: App, plugin: HabitTracker) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Settings #1')
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder('Enter your secret')
					.setValue(this.plugin.data?.settings.mySetting ?? '')
					.onChange(async (value) => {
						this.plugin.data.settings.mySetting = value;
						await this.plugin.savePluginData({
							settings: this.plugin.data.settings,
						});
					}),
			);
	}
}
