import { useBoardContext } from '../../context/BoardContext';
import styles from './TaskCard.module.css';

interface TaskCardProps {
	taskId: string;
}

export function TaskCard({ taskId }: TaskCardProps) {
	const { state, deleteTask } = useBoardContext();
	const task = state.tasks[taskId];

	if (!task) {
		return null;
	}

	return (
		<div className={styles.card}>
			<span className={styles.text}>{task.text}</span>
			<button
				className={styles.deleteBtn}
				onClick={() => deleteTask(taskId)}
				title="Delete task"
				aria-label="Delete task"
			>
				✕
			</button>
		</div>
	);
}
