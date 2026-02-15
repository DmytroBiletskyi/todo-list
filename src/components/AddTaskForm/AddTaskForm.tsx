import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import styles from './AddTaskForm.module.css';

interface AddTaskFormProps {
	onAdd: (text: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
	const [text, setText] = useState('');

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		const trimmed = text.trim();
		if (!trimmed) {
			return;
		}

		onAdd(trimmed);
		setText('');
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<input
				className={styles.input}
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Add a task..."
			/>
			<button className={styles.button} type="submit" disabled={!text.trim()}>
				+ Add
			</button>
		</form>
	);
}
