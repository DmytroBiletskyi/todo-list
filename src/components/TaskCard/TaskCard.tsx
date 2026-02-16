import { useState, useRef, useEffect } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { useBoardContext } from '../../context/BoardContext';
import styles from './TaskCard.module.css';

interface TaskCardProps {
	taskId: string;
	index: number;
	columnId: string;
}

export function TaskCard({ taskId, index, columnId }: TaskCardProps) {
	const { state, deleteTask, toggleTask, editTask, selectedTaskIds, toggleTaskSelection } =
		useBoardContext();
	const task = state.tasks[taskId];

	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const cardRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [isEditing]);

	useEffect(() => {
		const el = cardRef.current;
		if (!el) {
			return;
		}

		return combine(
			draggable({
				element: el,
				getInitialData: () => ({ type: 'task', taskId, columnId, index }),
				onDragStart: () => setIsDragging(true),
				onDrop: () => setIsDragging(false),
			}),
			dropTargetForElements({
				element: el,
				getData: () => ({ type: 'task', taskId, columnId, index }),
				canDrop: ({ source }) => source.data.type === 'task' && source.data.taskId !== taskId,
				onDragEnter: () => setIsDraggedOver(true),
				onDragLeave: () => setIsDraggedOver(false),
				onDrop: () => setIsDraggedOver(false),
			}),
		);
	}, [taskId, columnId, index]);

	const isSelected = selectedTaskIds.has(taskId);

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

	const cardClassName = [
		styles.card,
		task.completed ? styles.completed : '',
		isSelected ? styles.selected : '',
		isDragging ? styles.dragging : '',
		isDraggedOver ? styles.draggedOver : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div ref={cardRef} className={cardClassName}>
			<div className={styles.left}>
				<input
					type="checkbox"
					className={styles.selectCheckbox}
					checked={isSelected}
					onChange={() => toggleTaskSelection(taskId)}
					title="Select task"
				/>
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
