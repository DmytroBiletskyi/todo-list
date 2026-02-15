import { useState, useRef, useEffect } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import styles from './TaskCard.module.css';

interface TaskCardProps {
	taskId: string;
}

export function TaskCard({ taskId }: TaskCardProps) {
	const { state, deleteTask, toggleTask, editTask } = useBoardContext();
	const task = state.tasks[taskId];

	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [isEditing]);

	if (!task) {
		return null;
	}

	const handleStartEdit = () => {
		setEditText(task.text);
		setIsEditing(true);
	};

	const handleSaveEdit = () => {
		const trimmed = editText.trim();
		if (trimmed && trimmed !== task.text) {
			editTask(taskId, trimmed);
		}
		setIsEditing(false);
	};

	const cardClassName = [styles.card, task.completed ? styles.completed : ''].filter(Boolean).join(' ');

	return (
		<div className={cardClassName}>
			<div className={styles.left}>
				<button
					className={`${styles.toggleBtn} ${task.completed ? styles.toggleCompleted : ''}`}
					onClick={() => toggleTask(taskId)}
					title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
					aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
				>
					{task.completed ? '✓' : ''}
				</button>

				{isEditing ? (
					<input
						ref={inputRef}
						className={styles.editInput}
						value={editText}
						onChange={(e) => setEditText(e.target.value)}
						onBlur={handleSaveEdit}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleSaveEdit();
							}
							if (e.key === 'Escape') {
								setIsEditing(false);
							}
						}}
					/>
				) : (
					<span className={styles.text} onDoubleClick={handleStartEdit} title="Double-click to edit">
						{task.text}
					</span>
				)}
			</div>

			<div className={styles.right}>
				<button className={styles.actionBtn} onClick={handleStartEdit} title="Edit task" aria-label="Edit task">
					✏️
				</button>
				<button
					className={styles.actionBtn}
					onClick={() => deleteTask(taskId)}
					title="Delete task"
					aria-label="Delete task"
				>
					✕
				</button>
			</div>
		</div>
	);
}
