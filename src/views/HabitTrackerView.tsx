import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { App } from '../components/App';
import HabitTracker from '../main';
import { getStartOfWeek } from '../helpers';
import { HabitTrackerState } from '../types';

export const HABIT_TRACKER_VIEW_TYPE = 'habit-tracker-view';

export class HabitTrackerView extends ItemView {
	root: Root | null = null;
	plugin: HabitTracker;
	ref: Date;

	constructor(leaf: WorkspaceLeaf, plugin: HabitTracker) {
		super(leaf);
		this.plugin = plugin;
		this.ref = getStartOfWeek(new Date());
	}

	getViewType(): string {
		return HABIT_TRACKER_VIEW_TYPE;
	}

	getDisplayText(): string {
		return 'Habit Tracker';
	}

	get data() {
		return this.plugin.data as HabitTrackerState;
	}

	protected onOpen(): Promise<void> {
		this.root = createRoot(this.containerEl);
		this.root.render(
			<StrictMode>
				<App initialState={this.data} />
			</StrictMode>,
		);

		return Promise.resolve();
	}

	protected onClose(): Promise<void> {
		this.root?.unmount();

		return Promise.resolve();
	}
}
