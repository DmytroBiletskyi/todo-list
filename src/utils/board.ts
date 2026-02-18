import type { Task, FilterStatus } from '../types';

// https://en.wikipedia.org/wiki/Levenshtein_distance
const levenshteinDistance = (str1: string, str2: string): number => {
	const len1 = str1.length;
	const len2 = str2.length;
	const matrix: number[][] = Array(len2 + 1)
		.fill(null)
		.map(() => Array(len1 + 1).fill(0));

	for (let i = 0; i <= len1; i++) matrix[0][i] = i;
	for (let j = 0; j <= len2; j++) matrix[j][0] = j;

	for (let j = 1; j <= len2; j++) {
		for (let i = 1; i <= len1; i++) {
			const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
			matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator);
		}
	}
	return matrix[len2][len1];
};

const calculateSimilarity = (str1: string, str2: string): number => {
	const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
	const maxLength = Math.max(str1.length, str2.length);
	return 1 - distance / maxLength;
};

const threshold = 0.3;

export function filterTasks(
	taskIds: string[],
	tasks: Record<string, Task>,
	searchQuery: string,
	filterStatus: FilterStatus
): string[] {
	const query = searchQuery.toLowerCase();

	return taskIds.filter((id) => {
		const task = tasks[id];
		if (!task) {
			return false;
		}

		const directMatch = task.text.toLowerCase().includes(query.toLowerCase());
		const similarity = calculateSimilarity(task.text, query);

		if (query && !(directMatch || similarity >= threshold)) {
			return false;
		}

		if (filterStatus === 'completed' && !task.completed) {
			return false;
		}
		if (filterStatus === 'incomplete' && task.completed) {
			return false;
		}

		return true;
	});
}
