import type { Task, FilterStatus } from '../types';

export function filterTasks(
	taskIds: string[],
	tasks: Record<string, Task>,
	searchQuery: string,
	filterStatus: FilterStatus
): string[] {
	const query = searchQuery.toLowerCase();

	return taskIds.filter((id) => {
		const task = tasks[id];
		if (!task) {
			return false;
		}

		if (query && !task.text.toLowerCase().includes(query)) {
			return false;
		}

		// TODO: do not use hardcoded strings for filter status
		if (filterStatus === 'completed' && !task.completed) {
			return false;
		}
		if (filterStatus === 'incomplete' && task.completed) {
			return false;
		}

		return true;
	});
}
