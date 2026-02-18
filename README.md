# Task Board

Kanban-style task management app built with React + TypeScript + Vite.

**Live demo:** https://todo-list-3feorn2kj-dmytros-projects-b07917bd.vercel.app/

## Tech Stack

- React 19 + TypeScript
- Vite
- CSS Modules
- Pragmatic Drag and Drop (@atlaskit/pragmatic-drag-and-drop)
- ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install dependencies

npm install

### Run development server

npm run dev

# Opens at http://localhost:5173

### Build for production

npm run build

### Preview production build

npm run preview

## Code Quality

### Lint

npm run lint

### Type check

npm run typecheck

### Format code

npm run format

### Check formatting

npm run format:check

## Features

- Add, edit, delete tasks and columns
- Drag and drop tasks between columns and reorder within column
- Drag and drop to reorder columns
- Multi-drag: select multiple tasks and drag them all at once to a new column or position
- Mark tasks as complete / incomplete
- Multi-select tasks with checkboxes
- Select All in a column
- Bulk actions: complete, incomplete, move to column, delete
- Search tasks by name with fuzzy matching (Levenshtein distance)
- Search term highlighting in task cards
- Filter tasks by completion status (All / Active / Completed)
- Inline editing of task text and column title (double-click)
- Persistent state via localStorage
- Responsive design (mobile + desktop)
