import { useBoardContext } from '../../context/BoardContext';
import { TaskCard } from '../TaskCard/TaskCard';
import { AddTaskForm } from '../AddTaskForm/AddTaskForm';
import styles from './Column.module.css';

interface ColumnProps {
	columnId: string;
}

export function Column({ columnId }: ColumnProps) {
	const { state, addTask } = useBoardContext();
	const column = state.columns[columnId];

	if (!column) {
		return null;
	}

	return (
		<div className={styles.column}>
			<div className={styles.header}>
				<h3 className={styles.title}>{column.title}</h3>
				<span className={styles.count}>{column.taskIds.length}</span>
			</div>

			<div className={styles.taskList}>
				{column.taskIds.length === 0 && <p className={styles.empty}>No tasks yet</p>}
				{column.taskIds.map((taskId) => (
					<TaskCard key={taskId} taskId={taskId} />
				))}
			</div>

			<AddTaskForm onAdd={(text) => addTask(columnId, text)} />
		</div>
	);
}
