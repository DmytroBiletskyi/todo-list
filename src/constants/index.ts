import type { BoardState } from '../types';

export const LOCAL_STORAGE_KEY = 'todo-board-state';

export const DEFAULT_BOARD_STATE: BoardState = {
	tasks: {
		'task-1': {
			id: 'task-1',
			text: 'Fix critical production bug',
			completed: false,
			columnId: 'column-1',
			createdAt: 1740000000000
		},
		'task-2': {
			id: 'task-2',
			text: 'Server migration',
			completed: false,
			columnId: 'column-1',
			createdAt: 1740001000000
		},
		'task-3': {
			id: 'task-3',
			text: 'Security patch v1.2',
			completed: false,
			columnId: 'column-1',
			createdAt: 1740002000000
		},
		'task-4': {
			id: 'task-4',
			text: 'Update API documentation',
			completed: true,
			columnId: 'column-2',
			createdAt: 1740003000000
		},
		'task-5': {
			id: 'task-5',
			text: 'Implement OAuth2 flow',
			completed: false,
			columnId: 'column-2',
			createdAt: 1740004000000
		},
		'task-6': {
			id: 'task-6',
			text: 'Refactor state management',
			completed: false,
			columnId: 'column-2',
			createdAt: 1740005000000
		},
		'task-7': {
			id: 'task-7',
			text: 'Design new landing page',
			completed: false,
			columnId: 'column-2',
			createdAt: 1740006000000
		},
		'task-8': {
			id: 'task-8',
			text: 'Fix CSS alignment in footer',
			completed: true,
			columnId: 'column-3',
			createdAt: 1740007000000
		},
		'task-9': {
			id: 'task-9',
			text: 'Update favicon',
			completed: false,
			columnId: 'column-3',
			createdAt: 1740008000000
		},
		'task-10': {
			id: 'task-10',
			text: 'Add logging to auth helper',
			completed: false,
			columnId: 'column-3',
			createdAt: 1740009000000
		}
	},
	columns: {
		'column-1': {
			id: 'column-1',
			title: 'Critical',
			taskIds: ['task-1', 'task-2', 'task-3']
		},
		'column-2': {
			id: 'column-2',
			title: 'Major',
			taskIds: ['task-4', 'task-5', 'task-6', 'task-7']
		},
		'column-3': {
			id: 'column-3',
			title: 'Minor',
			taskIds: ['task-8', 'task-9', 'task-10']
		}
	},
	columnOrder: ['column-1', 'column-2', 'column-3']
};
