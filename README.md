
Ticket Management System

A frontend ticket management application built with React, TypeScript, and React Router that allows users to create, manage, and track tickets with advanced UI features and analytics.

Features
Ticket Management
Create, edit, and delete tickets
View detailed ticket information
Track ticket status, priority, assignee, and reporter
Advanced Search & Filtering
Fuzzy search with debouncing
Filter by status and priority
Sort by multiple fields (date, title, assignee, etc.)
Pagination
Custom pagination system
Dynamic page navigation
Bulk Actions
Multi-select tickets
Bulk delete with confirmation
Bulk update:
Status (with workflow validation)
Priority
Workflow Validation
Enforces valid ticket status transitions
Prevents invalid updates
Activity & Comments
Activity history tracking for each ticket
Comment system for collaboration
Logs all changes (status, priority, etc.)
Dashboard Analytics
Ticket statistics and metrics
Status and priority breakdown
Ticket health indicators:
High-priority pending tickets
Unassigned tickets
Stale tickets
Assignee and reporter insights

UX Enhancements
Keyboard shortcuts (e.g., / to focus search)
Toast notifications for actions
Confirmation modals for destructive actions
Empty states for better user experience
🛠️ Tech Stack
React
TypeScript
React Router
React Toastify
Custom hooks and utilities

🌐 Deployment
This project is deployed using Vercel.

Key Highlights
Reusable form architecture for ticket creation and editing
Fuzzy search implementation with debouncing
Bulk operations with validation and feedback
Activity logging system for audit trail simulation
Dashboard with computed analytics and insights
Clean state management using React hooks

Author
Kurt Allen A. Marquez

Notes
This project is frontend-only and simulates backend behavior using local state and utility functions.
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> 509f407 (Initial commit)
