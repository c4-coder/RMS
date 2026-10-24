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
  # Alfresco Content Workspace

  Frontend-first enterprise content management workspace built with React, TypeScript, Vite, Bootstrap 5, and Lucide React.

  ## Run locally

  ```sh
  npm install
  npm run dev
  ```

  ## Checks

  ```sh
  npm run lint
  npm run build
  ```

  ## Current scope

  The Overview and repository views use typed local demo data in `src/data/demoRepository.ts`. Folder creation, rename, upload-listing, favorites, trash, search, filtering, list/grid views, and the properties panel are frontend-only and are not persisted. Login, registration, and recovery forms validate input but are not connected to authentication. Workflow and administration navigation is present as a shell, with module screens to be implemented in later frontend work.

  Supabase and Node.js integration have not been started. Supabase is intended to be the only database/backend platform when that phase begins; no other database is part of the project.
])
