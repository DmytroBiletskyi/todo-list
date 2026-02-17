import { useState } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import styles from './Toolbar.module.css';

export function Toolbar() {
	const { state, selectedTaskIds, deselectAll, bulkDeleteTasks, bulkToggleTasks, bulkMoveTasks } = useBoardContext();
	const [moveTarget, setMoveTarget] = useState('');

	const count = selectedTaskIds.size;
	if (count === 0) {
		return null;
	}

	const ids = Array.from(selectedTaskIds);

	const handleMove = () => {
		if (moveTarget) {
			bulkMoveTasks(ids, moveTarget);
			setMoveTarget('');
		}
	};

	return (
		<div className={styles.toolbar}>
			<span className={styles.count}>
				{count} task{count > 1 ? 's' : ''} selected
			</span>

			<div className={styles.actions}>
				<button className={styles.btn} onClick={() => bulkToggleTasks(ids, true)}>
					✓ Complete
				</button>
				<button className={styles.btn} onClick={() => bulkToggleTasks(ids, false)}>
					○ Incomplete
				</button>

				<div className={styles.moveGroup}>
					<select
						className={styles.select}
						value={moveTarget}
						onChange={(e) => setMoveTarget(e.target.value)}
					>
						<option value="">Move to...</option>
						{state.columnOrder.map((colId) => (
							<option key={colId} value={colId}>
								{state.columns[colId].title}
							</option>
						))}
					</select>
					<button className={styles.btn} onClick={handleMove} disabled={!moveTarget}>
						Move
					</button>
				</div>

				<button className={`${styles.btn} ${styles.danger}`} onClick={() => bulkDeleteTasks(ids)}>
					Delete
				</button>

				<button className={styles.btnGhost} onClick={deselectAll}>
					Cancel
				</button>
			</div>
		</div>
	);
}
