import { BoardProvider } from './context/BoardContext';
import { Board } from './components/Board/Board';
import styles from './App.module.css';

function App() {
	return (
		<BoardProvider>
			<div className={styles.app}>
				<header className={styles.header}>
					<h1 className={styles.title}>Task Board</h1>
				</header>
				<Board />
			</div>
		</BoardProvider>
	);
}

export default App;
