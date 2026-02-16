import { useState, useRef, useEffect } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { useBoardContext } from '../../context/BoardContext';
import { TaskCard } from '../TaskCard/TaskCard';
import { AddTaskForm } from '../AddTaskForm/AddTaskForm';
import styles from './Column.module.css';

interface ColumnProps {
	columnId: string;
	index: number;
}

export function Column({ columnId, index }: ColumnProps) {
	const { state, addTask, deleteColumn, editColumn, selectAllInColumn, isAllSelectedInColumn } = useBoardContext();
	const column = state.columns[columnId];

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [titleText, setTitleText] = useState('');
	const titleInputRef = useRef<HTMLInputElement>(null);

	const columnRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isOver, setIsOver] = useState(false);

	useEffect(() => {
		if (isEditingTitle) {
			titleInputRef.current?.focus();
			titleInputRef.current?.select();
		}
	}, [isEditingTitle]);

	useEffect(() => {
		const el = columnRef.current;
		const handle = headerRef.current;
		if (!el || !handle) {
			return;
		}

		return combine(
			draggable({
				element: el,
				dragHandle: handle,
				getInitialData: () => ({ type: 'column', columnId, index }),
				onDragStart: () => setIsDragging(true),
				onDrop: () => setIsDragging(false)
			}),
			dropTargetForElements({
				element: el,
				getData: () => ({ type: 'column', columnId, index }),
				canDrop: ({ source }) => source.data.type === 'task' || source.data.type === 'column',
				onDragEnter: () => setIsOver(true),
				onDragLeave: () => setIsOver(false),
				onDrop: () => setIsOver(false)
			})
		);
	}, [columnId, index]);

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

	const allSelected = isAllSelectedInColumn(columnId);

	const columnClassName = [styles.column, isDragging ? styles.dragging : '', isOver ? styles.over : '']
		.filter(Boolean)
		.join(' ');

	return (
		<div ref={columnRef} className={columnClassName}>
			<div ref={headerRef} className={styles.header}>
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
				</div>
				<div className={styles.headerRight}>
					<label className={styles.selectAll}>
						<input type="checkbox" checked={allSelected} onChange={() => selectAllInColumn(columnId)} />
						<span className={styles.selectAllLabel}>All</span>
					</label>
					<button
						className={styles.deleteBtn}
						onClick={handleDeleteColumn}
						title="Delete column"
						aria-label="Delete column"
					>
						✕
					</button>
				</div>
			</div>

			<div className={styles.taskList}>
				{column.taskIds.length === 0 && <p className={styles.empty}>No tasks yet</p>}
				{column.taskIds.map((taskId) => (
					<TaskCard key={taskId} taskId={taskId} index={index} columnId={columnId} />
				))}
			</div>

			<AddTaskForm onAdd={(text) => addTask(columnId, text)} />
		</div>
	);
}
