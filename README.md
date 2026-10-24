# Alfresco Content Workspace

A frontend-first enterprise content management workspace built with React, TypeScript, Vite, Bootstrap 5, and Lucide React.

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:5173/`. Protected routes redirect to `/login`.

### Demo login

- Email: `alex@northstar.example`
- Password: `AlfrescoDemo2026!`

These credentials are hardcoded for the local UI preview only. They are not production credentials and are not sent to a server.

## Checks

```sh
npm run lint
npm run build
```

## Architecture

- `src/app/`: route table, auth guard, and persistent application shell
- `src/components/`: shared accessible modal, page header, and status badge
- `src/features/`: route-owned account, administration, auth, dashboard, organization, repository, and workflow screens
- `src/features/demo/`: typed domain records, sample data, and session state provider
- `src/Features.css`: feature-level responsive styling
- `src/Workspace.css`: shared shell and authentication styling

Feature pages own their forms and dialogs; shared domain state is exposed through `useDemoData`. Bootstrap provides the layout and base controls, with feature-specific styles scoped to application class names.

## Implemented frontend

- Dashboard with document, sharing, workflow, storage, activity, and workspace summaries
- Repository screens for My Files, Recent, Favorites, Shared with Me, Trash, and Search
- Folder navigation, filters, sorting, list/grid modes, multi-select, and properties
- Document preview, metadata, comments, versions, sharing, upload listing, move, copy, download information, rename, trash, and restore dialogs
- Workspaces and document libraries with creation and detail dialogs
- Tasks, approvals, workflow history, review details, comments, and local decisions
- Notifications, profile, preferences, user management, groups and membership, roles, audit history, storage policies, and system settings
- Login, registration, and password recovery forms with validation

## Current limitations

All repository, task, group, user, and notification changes live in memory and reset on refresh. Upload only adds file metadata to the visible list; file contents are not stored. Demo authentication is a local UI gate, not secure authentication. Sharing, roles, audit entries, and policy controls are illustrative and are not enforced by a backend.

Supabase and Node.js integration have not started. Supabase is intended to be the only database/backend platform in the later integration phase; no other database is planned.
