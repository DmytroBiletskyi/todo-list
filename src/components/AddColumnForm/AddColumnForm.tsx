import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import styles from './AddColumnForm.module.css';

export function AddColumnForm() {
	const { addColumn } = useBoardContext();
	const [isAdding, setIsAdding] = useState(false);
	const [title, setTitle] = useState('');

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		const trimmed = title.trim();
		if (!trimmed) {
			return;
		}

		addColumn(trimmed);
		setTitle('');
		setIsAdding(false);
	};

	const handleCancel = () => {
		setTitle('');
		setIsAdding(false);
	};

	if (!isAdding) {
		return (
			<button className={styles.addButton} onClick={() => setIsAdding(true)}>
				+ Add Column
			</button>
		);
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<input
				autoFocus
				className={styles.input}
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Column title..."
				onKeyDown={(e) => {
					if (e.key === 'Escape') {
						handleCancel();
					}
				}}
			/>
			<div className={styles.actions}>
				<button className={styles.submit} type="submit" disabled={!title.trim()}>
					Add
				</button>
				<button className={styles.cancel} type="button" onClick={handleCancel}>
					✕
				</button>
			</div>
		</form>
	);
}
