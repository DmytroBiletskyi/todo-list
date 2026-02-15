export interface Task {
	id: string;
	text: string;
	completed: boolean;
	columnId: string;
	createdAt: number;
}

export interface Column {
	id: string;
	title: string;
	taskIds: string[];
}

export interface BoardState {
	tasks: Record<string, Task>;
	columns: Record<string, Column>;
	columnOrder: string[];
}
