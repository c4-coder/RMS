import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useDemoData } from '../features/demo/useDemoData'
import { AppShell } from './AppShell'

const AuthScreen = lazy(() =>
  import('../features/auth/AuthScreen').then((module) => ({
    default: module.AuthScreen,
  })),
)
const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)
const RepositoryPage = lazy(() =>
  import('../features/repository/RepositoryPage').then((module) => ({
    default: module.RepositoryPage,
  })),
)
const OrganizationPage = lazy(() =>
  import('../features/organization/OrganizationPage').then((module) => ({
    default: module.OrganizationPage,
  })),
)
const WorkflowPage = lazy(() =>
  import('../features/workflow/WorkflowPage').then((module) => ({
    default: module.WorkflowPage,
  })),
)
const AdministrationPage = lazy(() =>
  import('../features/administration/AdministrationPage').then((module) => ({
    default: module.AdministrationPage,
  })),
)
const GroupsPage = lazy(() =>
  import('../features/administration/GroupsPage').then((module) => ({
    default: module.GroupsPage,
  })),
)
const NotificationsPage = lazy(() =>
  import('../features/account/AccountPages').then((module) => ({
    default: module.NotificationsPage,
  })),
)
const PreferencesPage = lazy(() =>
  import('../features/account/AccountPages').then((module) => ({
    default: module.PreferencesPage,
  })),
)
const ProfilePage = lazy(() =>
  import('../features/account/AccountPages').then((module) => ({
    default: module.ProfilePage,
  })),
)

function RequireDemoLogin() {
  const { isAuthenticated } = useDemoData()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <main className="route-loading" role="status">
          <span className="route-loading-mark">A</span>
          <strong>Loading Alfresco</strong>
        </main>
      }
    >
      <Routes>
        <Route path="/login" element={<AuthScreen mode="login" />} />
        <Route path="/register" element={<AuthScreen mode="register" />} />
        <Route
          path="/forgot-password"
          element={<AuthScreen mode="recovery" />}
        />
        <Route element={<RequireDemoLogin />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<DashboardPage />} />
            <Route
              path="my-files"
              element={<RepositoryPage view="my-files" />}
            />
            <Route path="recent" element={<RepositoryPage view="recent" />} />
            <Route
              path="favorites"
              element={<RepositoryPage view="favorites" />}
            />
            <Route path="shared" element={<RepositoryPage view="shared" />} />
            <Route path="trash" element={<RepositoryPage view="trash" />} />
            <Route path="search" element={<RepositoryPage view="search" />} />
            <Route
              path="workspaces"
              element={<OrganizationPage view="workspaces" />}
            />
            <Route
              path="libraries"
              element={<OrganizationPage view="libraries" />}
            />
            <Route path="tasks" element={<WorkflowPage view="tasks" />} />
            <Route
              path="approvals"
              element={<WorkflowPage view="approvals" />}
            />
            <Route
              path="workflow-history"
              element={<WorkflowPage view="history" />}
            />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route
              path="admin/users"
              element={<AdministrationPage view="users" />}
            />
            <Route path="admin/groups" element={<GroupsPage />} />
            <Route
              path="admin/roles"
              element={<AdministrationPage view="roles" />}
            />
            <Route
              path="admin/audit"
              element={<AdministrationPage view="audit" />}
            />
            <Route
              path="admin/storage"
              element={<AdministrationPage view="storage" />}
            />
            <Route
              path="admin/settings"
              element={<AdministrationPage view="settings" />}
            />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
