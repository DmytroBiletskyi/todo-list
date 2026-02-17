import { useBoardContext } from '../../context/BoardContext';
import styles from './SearchBar.module.css';

export function SearchBar() {
	const { searchQuery, setSearchQuery } = useBoardContext();

	return (
		<div className={styles.wrapper}>
			<span className={styles.icon}>🔍</span>
			<input
				type="text"
				className={styles.input}
				placeholder="Search tasks..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			{searchQuery && (
				<button className={styles.clear} onClick={() => setSearchQuery('')} aria-label="Clear search">
					✕
				</button>
			)}
		</div>
	);
}
