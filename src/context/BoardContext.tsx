import { createContext, useContext, useCallback, useMemo } from 'react';
import type { BoardState } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_BOARD_STATE, LOCAL_STORAGE_KEY } from '../constants';

interface BoardContextType {
	state: BoardState;
	addTask: (columnId: string, text: string) => void;
	deleteTask: (taskId: string) => void;
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

	const value = useMemo<BoardContextType>(
		() => ({
			state,
			addTask,
			deleteTask
		}),
		[state, addTask, deleteTask]
	);

	return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}
