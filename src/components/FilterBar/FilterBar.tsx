import { useBoardContext } from '../../context/BoardContext';
import type { FilterStatus } from '../../types';
import styles from './FilterBar.module.css';

const FILTERS: { value: FilterStatus; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'incomplete', label: 'Active' },
	{ value: 'completed', label: 'Completed' },
];

export function FilterBar() {
	const { filterStatus, setFilterStatus } = useBoardContext();

	return (
		<div className={styles.wrapper}>
			{FILTERS.map((filter) => (
				<button
					key={filter.value}
					className={`${styles.button} ${filterStatus === filter.value ? styles.active : ''}`}
					onClick={() => setFilterStatus(filter.value)}
				>
					{filter.label}
				</button>
			))}
		</div>
	);
}
