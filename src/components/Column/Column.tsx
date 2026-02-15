import { useState, useRef, useEffect } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import { TaskCard } from '../TaskCard/TaskCard';
import { AddTaskForm } from '../AddTaskForm/AddTaskForm';
import styles from './Column.module.css';

interface ColumnProps {
	columnId: string;
}

export function Column({ columnId }: ColumnProps) {
	const { state, addTask, deleteColumn, editColumn } = useBoardContext();
	const column = state.columns[columnId];

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [titleText, setTitleText] = useState('');
	const titleInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditingTitle) {
			titleInputRef.current?.focus();
			titleInputRef.current?.select();
		}
	}, [isEditingTitle]);

	if (!column) {
		return null;
	}

	const handleStartEditTitle = () => {
		setTitleText(column.title);
		setIsEditingTitle(true);
	};

	const handleSaveTitle = () => {
		const trimmed = titleText.trim();
		if (trimmed && trimmed !== column.title) {
			editColumn(columnId, trimmed);
		}
		setIsEditingTitle(false);
	};

	const handleDeleteColumn = () => {
		const confirmed = window.confirm(`Delete column "${column.title}" and all its tasks?`);
		if (confirmed) {
			deleteColumn(columnId);
		}
	};

	return (
		<div className={styles.column}>
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					{isEditingTitle ? (
						<input
							ref={titleInputRef}
							className={styles.titleInput}
							value={titleText}
							onChange={(e) => setTitleText(e.target.value)}
							onBlur={handleSaveTitle}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSaveTitle();
								}
								if (e.key === 'Escape') {
									setIsEditingTitle(false);
								}
							}}
						/>
					) : (
						<h3 className={styles.title} onDoubleClick={handleStartEditTitle} title="Double-click to edit">
							{column.title}
						</h3>
					)}
					<span className={styles.count}>{column.taskIds.length}</span>
				</div>
				<button
					className={styles.deleteBtn}
					onClick={handleDeleteColumn}
					title="Delete column"
					aria-label="Delete column"
				>
					✕
				</button>
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
