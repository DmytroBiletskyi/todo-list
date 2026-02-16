import { useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useBoardContext } from '../../context/BoardContext';
import { Column } from '../Column/Column';
import { AddColumnForm } from '../AddColumnForm/AddColumnForm';
import styles from './Board.module.css';

export function Board() {
	const { state, moveTaskToColumn, reorderTask, reorderColumn } = useBoardContext();

	useEffect(() => {
		return monitorForElements({
			onDrop: ({ source, location }) => {
				const destination = location.current.dropTargets[0];
				if (!destination) {
					return;
				}

				const sourceData = source.data;
				const destData = destination.data;

				if (sourceData.type === 'task') {
					const taskId = sourceData.taskId as string;
					const sourceColumnId = sourceData.columnId as string;
					const sourceIndex = sourceData.index as number;

					if (destData.type === 'task') {
						const destColumnId = destData.columnId as string;
						const destIndex = destData.index as number;

						if (sourceColumnId === destColumnId) {
							reorderTask(sourceColumnId, sourceIndex, destIndex);
						} else {
							moveTaskToColumn(taskId, destColumnId, destIndex);
						}
					} else if (destData.type === 'column') {
						const destColumnId = destData.columnId as string;
						if (sourceColumnId !== destColumnId) {
							moveTaskToColumn(taskId, destColumnId);
						}
					}
				}

				if (sourceData.type === 'column' && destData.type === 'column') {
					const sourceIdx = sourceData.index as number;
					const destIdx = destData.index as number;
					if (sourceIdx !== destIdx) {
						reorderColumn(sourceIdx, destIdx);
					}
				}
			}
		});
	}, [moveTaskToColumn, reorderTask, reorderColumn]);

	return (
		<div className={styles.board}>
			{state.columnOrder.map((columnId, index) => (
				<Column key={columnId} columnId={columnId} index={index} />
			))}
			<AddColumnForm />
		</div>
	);
}
