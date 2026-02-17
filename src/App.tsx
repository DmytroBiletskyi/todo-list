import { BoardProvider } from './context/BoardContext';
import { Board } from './components/Board/Board';
import { SearchBar } from './components/SearchBar/SearchBar';
import { FilterBar } from './components/FilterBar/FilterBar';
import { Toolbar } from './components/Toolbar/Toolbar';
import styles from './App.module.css';

function App() {
	return (
		<BoardProvider>
			<div className={styles.app}>
				<header className={styles.header}>
					<h1 className={styles.title}>Task Board</h1>
				</header>
				<div className={styles.controls}>
					<SearchBar />
					<FilterBar />
				</div>
				<Board />
				<Toolbar />
			</div>
		</BoardProvider>
	);
}

export default App;
