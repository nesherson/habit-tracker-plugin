import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { App } from '../components/App';
import HabitTracker from '../main';

export const HABIT_TRACKER_VIEW_TYPE = 'habit-tracker-view';

export class HabitTrackerView extends ItemView {
	root: Root | null = null;
	plugin: HabitTracker;

	constructor(leaf: WorkspaceLeaf, plugin: HabitTracker) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return HABIT_TRACKER_VIEW_TYPE;
	}

	getDisplayText(): string {
		return 'Habit tracker';
	}

	get data() {
		return this.plugin.data;
	}

	protected onOpen(): Promise<void> {
		this.root = createRoot(this.containerEl);
		this.root.render(
			<StrictMode>
				<App initialState={this.data.state} plugin={this.plugin} />
			</StrictMode>,
		);

		return Promise.resolve();
	}

	protected onClose(): Promise<void> {
		this.root?.unmount();

		return Promise.resolve();
	}
}
