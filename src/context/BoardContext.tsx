import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import type { BoardState, FilterStatus } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_BOARD_STATE, LOCAL_STORAGE_KEY } from '../constants';

interface BoardContextType {
	state: BoardState;
	addTask: (columnId: string, text: string) => void;
	deleteTask: (taskId: string) => void;
	editTask: (taskId: string, text: string) => void;
	toggleTask: (taskId: string) => void;

	addColumn: (title: string) => void;
	deleteColumn: (columnId: string) => void;
	editColumn: (columnId: string, title: string) => void;

	moveTaskToColumn: (taskId: string, targetColumnId: string, targetIndex?: number) => void;
	reorderTask: (columnId: string, startIndex: number, endIndex: number) => void;
	reorderColumn: (startIndex: number, endIndex: number) => void;

	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filterStatus: FilterStatus;
	setFilterStatus: (status: FilterStatus) => void;

	selectedTaskIds: Set<string>;
	toggleTaskSelection: (taskId: string) => void;
	selectAllInColumn: (columnId: string) => void;
	deselectAll: () => void;
	isAllSelectedInColumn: (columnId: string) => boolean;
}

const BoardContext = createContext<BoardContextType | null>(null);

export function useBoardContext(): BoardContextType {
	const context = useContext(BoardContext);

	if (!context) {
		throw new Error('useBoardContext must be used within a BoardProvider');
	}

	return context;
}

export function BoardProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useLocalStorage<BoardState>(LOCAL_STORAGE_KEY, DEFAULT_BOARD_STATE);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
	const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

	const addTask = useCallback(
		(columnId: string, text: string) => {
			const trimmed = text.trim();
			if (!trimmed) {
				return;
			}

			const taskId = crypto.randomUUID();

			setState((prev) => ({
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: {
						id: taskId,
						text: trimmed,
						completed: false,
						columnId,
						createdAt: Date.now()
					}
				},
				columns: {
					...prev.columns,
					[columnId]: {
						...prev.columns[columnId],
						taskIds: [...prev.columns[columnId].taskIds, taskId]
					}
				}
			}));
		},
		[setState]
	);

	const deleteTask = useCallback(
		(taskId: string) => {
			setState((prev) => {
				const task = prev.tasks[taskId];
				if (!task) {
					return prev;
				}

				const remainingTasks = { ...prev.tasks };
				delete remainingTasks[taskId];
				const column = prev.columns[task.columnId];

				return {
					...prev,
					tasks: remainingTasks,
					columns: {
						...prev.columns,
						[column.id]: {
							...column,
							taskIds: column.taskIds.filter((id) => id !== taskId)
						}
					}
				};
			});
			setSelectedTaskIds((prev) => {
				if (!prev.has(taskId)) {
					return prev;
				}
				const next = new Set(prev);
				next.delete(taskId);
				return next;
			});
		},
		[setState]
	);

	const editTask = useCallback(
		(taskId: string, text: string) => {
			const trimmed = text.trim();
			if (!trimmed) {
				return;
			}
			setState((prev) => ({
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: { ...prev.tasks[taskId], text: trimmed }
				}
			}));
		},
		[setState]
	);

	const toggleTask = useCallback(
		(taskId: string) => {
			setState((prev) => ({
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: {
						...prev.tasks[taskId],
						completed: !prev.tasks[taskId].completed
					}
				}
			}));
		},
		[setState]
	);

	const addColumn = useCallback(
		(title: string) => {
			const trimmed = title.trim();
			if (!trimmed) {
				return;
			}

			const columnId = crypto.randomUUID();

			setState((prev) => ({
				...prev,
				columns: {
					...prev.columns,
					[columnId]: { id: columnId, title: trimmed, taskIds: [] }
				},
				columnOrder: [...prev.columnOrder, columnId]
			}));
		},
		[setState]
	);

	const deleteColumn = useCallback(
		(columnId: string) => {
			setState((prev) => {
				const column = prev.columns[columnId];
				if (!column) {
					return prev;
				}

				const remainingTasks = { ...prev.tasks };
				for (const taskId of column.taskIds) {
					delete remainingTasks[taskId];
				}

				const remainingColumns = { ...prev.columns };
				delete remainingColumns[columnId];

				return {
					...prev,
					tasks: remainingTasks,
					columns: remainingColumns,
					columnOrder: prev.columnOrder.filter((id) => id !== columnId)
				};
			});
			setSelectedTaskIds(new Set());
		},
		[setState]
	);

	const editColumn = useCallback(
		(columnId: string, title: string) => {
			const trimmed = title.trim();
			if (!trimmed) {
				return;
			}

			setState((prev) => ({
				...prev,
				columns: {
					...prev.columns,
					[columnId]: { ...prev.columns[columnId], title: trimmed }
				}
			}));
		},
		[setState]
	);

	const moveTaskToColumn = useCallback(
		(taskId: string, targetColumnId: string, targetIndex?: number) => {
			setState((prev) => {
				const task = prev.tasks[taskId];
				if (!task) {
					return prev;
				}

				const sourceColumnId = task.columnId;
				const sourceColumn = prev.columns[sourceColumnId];
				const targetColumn = prev.columns[targetColumnId];

				const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);

				let newTargetTaskIds: string[];
				if (sourceColumnId === targetColumnId) {
					newTargetTaskIds = newSourceTaskIds;
				} else {
					newTargetTaskIds = [...targetColumn.taskIds];
				}

				const insertAt = targetIndex !== undefined ? targetIndex : newTargetTaskIds.length;
				newTargetTaskIds.splice(insertAt, 0, taskId);

				return {
					...prev,
					tasks: {
						...prev.tasks,
						[taskId]: { ...task, columnId: targetColumnId }
					},
					columns: {
						...prev.columns,
						[sourceColumnId]: { ...sourceColumn, taskIds: newSourceTaskIds },
						[targetColumnId]: {
							...(sourceColumnId === targetColumnId ? sourceColumn : targetColumn),
							taskIds: newTargetTaskIds
						}
					}
				};
			});
		},
		[setState]
	);

	const reorderTask = useCallback(
		(columnId: string, startIndex: number, endIndex: number) => {
			setState((prev) => {
				const column = prev.columns[columnId];
				const newTaskIds = [...column.taskIds];
				const [removed] = newTaskIds.splice(startIndex, 1);
				newTaskIds.splice(endIndex, 0, removed);

				return {
					...prev,
					columns: {
						...prev.columns,
						[columnId]: { ...column, taskIds: newTaskIds }
					}
				};
			});
		},
		[setState]
	);

	const reorderColumn = useCallback(
		(startIndex: number, endIndex: number) => {
			setState((prev) => {
				const newOrder = [...prev.columnOrder];
				const [removed] = newOrder.splice(startIndex, 1);
				newOrder.splice(endIndex, 0, removed);
				return { ...prev, columnOrder: newOrder };
			});
		},
		[setState]
	);

	const toggleTaskSelection = useCallback((taskId: string) => {
		setSelectedTaskIds((prev) => {
			const next = new Set(prev);
			if (next.has(taskId)) {
				next.delete(taskId);
			} else {
				next.add(taskId);
			}
			return next;
		});
	}, []);

	const selectAllInColumn = useCallback(
		(columnId: string) => {
			const column = state.columns[columnId];
			if (!column) {
				return;
			}

			setSelectedTaskIds((prev) => {
				const allSelected = column.taskIds.length > 0 && column.taskIds.every((id) => prev.has(id));
				const next = new Set(prev);
				if (allSelected) {
					for (const id of column.taskIds) {
						next.delete(id);
					}
				} else {
					for (const id of column.taskIds) {
						next.add(id);
					}
				}
				return next;
			});
		},
		[state.columns]
	);

	const deselectAll = useCallback(() => {
		setSelectedTaskIds(new Set());
	}, []);

	const isAllSelectedInColumn = useCallback(
		(columnId: string) => {
			const column = state.columns[columnId];
			if (!column || column.taskIds.length === 0) {
				return false;
			}
			return column.taskIds.every((id) => selectedTaskIds.has(id));
		},
		[state.columns, selectedTaskIds]
	);

	const value = useMemo<BoardContextType>(
		() => ({
			state,
			addTask,
			deleteTask,
			editTask,
			toggleTask,

			addColumn,
			deleteColumn,
			editColumn,

			moveTaskToColumn,
			reorderTask,
			reorderColumn,

			searchQuery,
			setSearchQuery,
			filterStatus,
			setFilterStatus,

			selectedTaskIds,
			toggleTaskSelection,
			selectAllInColumn,
			deselectAll,
			isAllSelectedInColumn
		}),
		[
			state,
			addTask,
			deleteTask,
			editTask,
			toggleTask,

			addColumn,
			deleteColumn,
			editColumn,

			moveTaskToColumn,
			reorderTask,
			reorderColumn,

			searchQuery,
			filterStatus,

			selectedTaskIds,
			toggleTaskSelection,
			selectAllInColumn,
			deselectAll,
			isAllSelectedInColumn
		]
	);

	return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}
