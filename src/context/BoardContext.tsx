import { createContext, useContext, useCallback, useMemo } from 'react';
import type { BoardState } from '../types';
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
}

const BoardContext = createContext<BoardContextType | null>(null);

// TODO: separate the useBoardContext hook from the BoardProvider component
export function useBoardContext(): BoardContextType {
	const context = useContext(BoardContext);

	if (!context) {
		throw new Error('useBoardContext must be used within a BoardProvider');
	}

	return context;
}

export function BoardProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useLocalStorage<BoardState>(LOCAL_STORAGE_KEY, DEFAULT_BOARD_STATE);

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

	const value = useMemo<BoardContextType>(
		() => ({
			state,
			addTask,
			deleteTask,
			editTask,
			toggleTask,
			addColumn,
			deleteColumn,
			editColumn
		}),
		[state, addTask, deleteTask, editTask, toggleTask, addColumn, deleteColumn, editColumn]
	);

	return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}
