import { ListTodo } from 'lucide-react';
import { ChangeEvent, MouseEvent, useState } from 'react';

import { ToDo } from '@/types/habitTrackerTypes';
import { uid } from '@/helpers';
import { useHabitTrackerContext } from '@/context/habitTrackerContext';
import { CheckListStore, ListStore } from '@/store/store';
import { useStore } from '@/store/useStore';
import { SidePanelList } from './components/SidePanelList';

interface LabelledItem {
	id: string;
	label: string;
}

export function Side() {
	const { store } = useHabitTrackerContext();

	const todos = useStore(store.todos);

	const [editItemId, setEditItemId] = useState<string | null>(null);
	const [editText, setEditText] = useState('');

	const handleItemClick = (item: LabelledItem) => {
		setEditItemId(item.id);
		setEditText(item.label);
	};

	const handleItemAdd = (list: CheckListStore<ToDo>) => {
		list.add({ id: uid(), label: 'New item', done: false });
	};

	const handleItemCheck = (
		e: MouseEvent<HTMLSpanElement>,
		list: CheckListStore<ToDo>,
		item: ToDo,
	) => {
		e.stopPropagation();
		list.toggle(item.id);
	};

	const handleEditTextChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEditText(e.target.value);
	};

	const handleEditTextBlur = (list: ListStore<LabelledItem>, id: string) => {
		const text = editText;

		setEditItemId(null);
		setEditText('');

		list.update(id, { label: text });
	};

	return (
		<div className="ht-side">
			<SidePanelList
				title="To-do"
				icon={ListTodo}
				items={todos}
				onItemCheck={(e, item) => handleItemCheck(e, store.todos, item)}
				onItemClick={handleItemClick}
				onAdd={() => handleItemAdd(store.todos)}
				onDelete={({ id }) => store.todos.remove(id)}
				editItemId={editItemId}
				editText={editText}
				onEditTextChange={handleEditTextChange}
				onEditTextBlur={(id) => handleEditTextBlur(store.todos, id)}
			/>
		</div>
	);
}
