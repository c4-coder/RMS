import { useState } from 'react'
import {
  Activity,
  Bell,
  Building2,
  Check,
  ChevronDown,
  Clock3,
  Files,
  HardDrive,
  History,
  LibraryBig,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings2,
  ShieldCheck,
  Star,
  Sun,
  Trash2,
  UsersRound,
  Workflow,
  X,
} from 'lucide-react'
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useDemoData } from '../features/demo/useDemoData'
import { formatRelative } from '../features/demo/formatters'

const personalNav = [
  { label: 'Overview', href: '/overview', icon: Activity },
  { label: 'My Files', href: '/my-files', icon: Files },
  { label: 'Recent', href: '/recent', icon: Clock3 },
  { label: 'Favorites', href: '/favorites', icon: Star },
  { label: 'Shared with me', href: '/shared', icon: UsersRound },
  { label: 'Trash', href: '/trash', icon: Trash2 },
]

const organizationNav = [
  { label: 'Workspaces', href: '/workspaces', icon: Building2 },
  { label: 'Document libraries', href: '/libraries', icon: LibraryBig },
  { label: 'Search', href: '/search', icon: Search },
]

const workflowNav = [
  { label: 'My tasks', href: '/tasks', icon: Check },
  { label: 'Approvals', href: '/approvals', icon: ShieldCheck },
  { label: 'Workflow history', href: '/workflow-history', icon: History },
]

const adminNav = [
  { label: 'Users and groups', href: '/admin/users', icon: UsersRound },
  { label: 'Groups', href: '/admin/groups', icon: UsersRound },
  { label: 'Roles and permissions', href: '/admin/roles', icon: ShieldCheck },
  { label: 'Audit logs', href: '/admin/audit', icon: History },
  { label: 'Storage and policies', href: '/admin/storage', icon: HardDrive },
  { label: 'System settings', href: '/admin/settings', icon: Settings2 },
]

const routeLabels: Record<string, string> = {
  '/overview': 'Overview',
  '/my-files': 'My Files',
  '/recent': 'Recent',
  '/favorites': 'Favorites',
  '/shared': 'Shared with me',
  '/trash': 'Trash',
  '/workspaces': 'Workspaces',
  '/libraries': 'Document libraries',
  '/search': 'Search',
  '/tasks': 'My tasks',
  '/approvals': 'Approvals',
  '/workflow-history': 'Workflow history',
  '/notifications': 'Notifications',
  '/profile': 'Your profile',
  '/preferences': 'Preferences',
  '/admin/users': 'Users and groups',
  '/admin/groups': 'Groups',
  '/admin/roles': 'Roles and permissions',
  '/admin/audit': 'Audit logs',
  '/admin/storage': 'Storage and policies',
  '/admin/settings': 'System settings',
}

export function AppShell() {
  const [dark, setDark] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { tasks, notifications, setNotifications, signOut } = useDemoData()
  const unreadCount = notifications.filter((item) => item.unread).length
  const pendingTasks = tasks.filter((task) => task.state !== 'Completed').length
  const currentLabel = routeLabels[location.pathname] ?? 'Overview'

  const runSearch = () => {
    navigate('/search', { state: { query: search.trim() } })
    setMobileNavOpen(false)
  }

  const logOut = () => {
    signOut()
    navigate('/login')
  }

  const renderNav = (items: typeof personalNav) =>
    items.map(({ label, href, icon: Icon }) => (
      <NavLink
        key={href}
        to={href}
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        onClick={() => setMobileNavOpen(false)}
      >
        <Icon size={17} strokeWidth={1.8} />
        <span>{label}</span>
        {href === '/tasks' && <span className="nav-count">{pendingTasks}</span>}
      </NavLink>
    ))

  return (
    <div className={`app-frame${dark ? ' theme-dark' : ''}`}>
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="mobile-scrim"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside className={`sidebar${mobileNavOpen ? ' sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <Link to="/overview" className="brand-link">
            <span className="brand-mark">
              <Files size={19} strokeWidth={2.2} />
            </span>
            <span className="brand-name">alfresco</span>
          </Link>
          <button
            type="button"
            className="icon-button sidebar-close"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">N</span>
          <span className="workspace-copy">
            <strong>Northstar Studio</strong>
            <small>Enterprise workspace</small>
          </span>
          <ChevronDown size={15} />
        </div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <div className="nav-group">
            <p className="nav-heading">PERSONAL</p>
            {renderNav(personalNav)}
          </div>
          <div className="nav-group">
            <p className="nav-heading">ORGANIZATION</p>
            {renderNav(organizationNav)}
          </div>
          <div className="nav-group">
            <p className="nav-heading">WORKFLOW</p>
            {renderNav(workflowNav)}
          </div>
          <div className="nav-group">
            <p className="nav-heading">ADMINISTRATION</p>
            {renderNav(adminNav)}
          </div>
        </nav>
        <div className="sidebar-bottom">
          <div className="storage-summary">
            <div className="storage-heading">
              <span>Storage</span>
              <span>68%</span>
            </div>
            <div className="storage-track">
              <span />
            </div>
            <small>6.8 GB of 10 GB used</small>
          </div>
          <Link to="/preferences" className="nav-link help-link">
            <Settings2 size={17} />
            <span>Preferences</span>
          </Link>
          <button
            type="button"
            className="account-card"
            onClick={() => navigate('/profile')}
          >
            <span className="user-avatar">AM</span>
            <span className="account-copy">
              <strong>Alex Morgan</strong>
              <small>Workspace admin</small>
            </span>
            <ChevronDown size={16} />
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button
            type="button"
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu size={20} />
          </button>
          <form
            className="global-search"
            onSubmit={(event) => {
              event.preventDefault()
              runSearch()
            }}
          >
            <Search size={17} />
            <input
              aria-label="Search all content"
              placeholder="Search files, folders, people, and tags"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd>Enter</kbd>
          </form>
          <div className="topbar-actions">
            <span className="topbar-location">{currentLabel}</span>
            <button
              type="button"
              className="icon-button"
              aria-label={dark ? 'Use light theme' : 'Use dark theme'}
              onClick={() => setDark((value) => !value)}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="popover-anchor">
              <button
                type="button"
                className="icon-button notification-button"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                onClick={() => {
                  setNotificationsOpen((value) => !value)
                  setProfileOpen(false)
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-dot" />}
              </button>
              {notificationsOpen && (
                <div className="floating-panel notification-panel">
                  <div className="floating-panel-title">
                    <strong>Notifications</strong>
                    <span className="unread-label">{unreadCount} unread</span>
                  </div>
                  {notifications.slice(0, 3).map((item) => (
                    <div className="notification-item" key={item.id}>
                      <span
                        className={`notification-icon ${item.kind === 'share' ? 'teal' : 'blue'}`}
                      >
                        {item.kind === 'share' ? (
                          <UsersRound size={15} />
                        ) : (
                          <Workflow size={15} />
                        )}
                      </span>
                      <p>
                        <strong>{item.title}</strong>
                        {item.description}
                        <small>{formatRelative(item.createdAt)}</small>
                      </p>
                    </div>
                  ))}
                  <Link
                    to="/notifications"
                    className="panel-footer-button"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    Open notification center
                  </Link>
                  <button
                    type="button"
                    className="panel-secondary-button"
                    onClick={() =>
                      setNotifications((current) =>
                        current.map((item) => ({ ...item, unread: false })),
                      )
                    }
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
            <div className="popover-anchor">
              <button
                type="button"
                className="topbar-user"
                onClick={() => {
                  setProfileOpen((value) => !value)
                  setNotificationsOpen(false)
                }}
              >
                <span className="user-avatar small">AM</span>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="floating-panel profile-panel">
                  <div className="profile-heading">
                    <span className="user-avatar">AM</span>
                    <div>
                      <strong>Alex Morgan</strong>
                      <small>alex@northstar.example</small>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="profile-panel-link"
                    onClick={() => setProfileOpen(false)}
                  >
                    <UsersRound size={15} />
                    Your profile
                  </Link>
                  <Link
                    to="/preferences"
                    className="profile-panel-link"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings2 size={15} />
                    Preferences
                  </Link>
                  <button
                    type="button"
                    className="profile-panel-link"
                    onClick={logOut}
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="workspace-main container-fluid">
          <div className="shell-breadcrumb">
            <Link to="/overview">Workspace</Link>
            <span>/</span>
            <strong>{currentLabel}</strong>
          </div>
          <Outlet />
          <footer className="workspace-footer">
            <span>Alfresco Content Workspace</span>
            <span>
              Private demo session <span className="footer-dot">·</span> Changes
              reset on refresh
            </span>
          </footer>
        </main>
      </div>
    </div>
  )
}
