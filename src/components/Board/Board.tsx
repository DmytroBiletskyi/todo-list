import { useBoardContext } from '../../context/BoardContext';
import { Column } from '../Column/Column';
import { AddColumnForm } from '../AddColumnForm/AddColumnForm';
import styles from './Board.module.css';

export function Board() {
	const { state } = useBoardContext();

	return (
		<div className={styles.board}>
			{state.columnOrder.map((columnId) => (
				<Column key={columnId} columnId={columnId} />
			))}
			<AddColumnForm />
		</div>
	);
}
