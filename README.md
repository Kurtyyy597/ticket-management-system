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
