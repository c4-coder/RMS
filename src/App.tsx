import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  Activity,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileImage,
  FileSpreadsheet,
  FileText,
  Files,
  Eye,
  EyeOff,
  Filter,
  Folder,
  FolderPlus,
  HardDrive,
  History,
  LayoutGrid,
  LibraryBig,
  List,
  LogOut,
  Menu,
  MoreHorizontal,
  Moon,
  PanelRight,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  Star,
  Sun,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  Workflow,
  X,
} from 'lucide-react'
import { demoRepository, type RepositoryItem } from './data/demoRepository'
import './Workspace.css'

const navigation = [
  {
    label: 'PERSONAL',
    items: [
      { label: 'Overview', href: '/overview', icon: Activity },
      { label: 'My Files', href: '/my-files', icon: Files },
      { label: 'Recent', href: '/recent', icon: Clock3 },
      { label: 'Favorites', href: '/favorites', icon: Star },
      { label: 'Shared with me', href: '/shared', icon: UsersRound },
      { label: 'Trash', href: '/trash', icon: Trash2 },
    ],
  },
  {
    label: 'ORGANIZATION',
    items: [
      { label: 'Workspaces', href: '/workspaces', icon: Building2 },
      { label: 'Document libraries', href: '/libraries', icon: LibraryBig },
      { label: 'Search', href: '/search', icon: Search },
    ],
  },
  {
    label: 'WORKFLOW',
    items: [
      { label: 'My tasks', href: '/tasks', icon: Check },
      { label: 'Approvals', href: '/approvals', icon: ShieldCheck },
      { label: 'Workflow history', href: '/workflow-history', icon: History },
    ],
  },
]

const adminNavigation = [
  { label: 'Users and groups', href: '/admin/users', icon: UsersRound },
  { label: 'Roles and permissions', href: '/admin/roles', icon: ShieldCheck },
  { label: 'Audit logs', href: '/admin/audit', icon: History },
  { label: 'Storage and policies', href: '/admin/storage', icon: HardDrive },
  { label: 'System settings', href: '/admin/settings', icon: Settings2 },
]

const routeTitles: Record<string, string> = {
  '/overview': 'Overview',
  '/notifications': 'Notifications',
  '/profile': 'Your profile',
  '/preferences': 'Preferences',
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
  '/admin/users': 'Users and groups',
  '/admin/roles': 'Roles and permissions',
  '/admin/audit': 'Audit logs',
  '/admin/storage': 'Storage and policies',
  '/admin/settings': 'System settings',
}

function App() {
  const [items, setItems] = useState(demoRepository)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [gridView, setGridView] = useState(false)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>('budget')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [menuItemId, setMenuItemId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<'create-folder' | 'rename' | null>(null)
  const [dialogValue, setDialogValue] = useState('')
  const [dialogItemId, setDialogItemId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = routeTitles[location.pathname] ? location.pathname : '/my-files'
  const title = routeTitles[pathname]
  const isTrash = pathname === '/trash'
  const isOverview = pathname === '/overview'
  const isRepositoryView = ['/my-files', '/recent', '/favorites', '/shared', '/trash', '/search', '/workspaces', '/libraries'].includes(pathname)
  const selectedItem = items.find((item) => item.id === selectedId)
  const currentFolder = items.find((item) => item.id === currentFolderId)

  const folderTrail = useMemo(() => {
    const trail: RepositoryItem[] = []
    let folder = currentFolder
    while (folder) {
      trail.unshift(folder)
      folder = items.find((item) => item.id === folder?.parentId && item.type === 'folder')
    }
    return trail
  }, [currentFolder, items])

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = items.filter((item) => {
      if (isTrash ? !item.trashed : item.trashed) return false
      if (pathname === '/my-files' && item.parentId !== currentFolderId) return false
      if (pathname === '/recent' && !item.recent) return false
      if (pathname === '/favorites' && !item.favorite) return false
      if (pathname === '/shared' && !item.shared) return false
      if ((pathname === '/workspaces' || pathname === '/libraries') && item.type !== 'folder') return false
      if (!isRepositoryView) return false
      if (typeFilter === 'documents' && item.type !== 'document') return false
      if (typeFilter === 'folders' && item.type !== 'folder') return false
      if (normalizedQuery && !`${item.name} ${item.tags.join(' ')}`.toLowerCase().includes(normalizedQuery)) return false
      return true
    })
    return [...filtered].sort((first, second) => {
      if (first.type !== second.type) return first.type === 'folder' ? -1 : 1
      return second.modifiedAt.localeCompare(first.modifiedAt)
    })
  }, [currentFolderId, isRepositoryView, isTrash, items, pathname, query, typeFilter])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const openDialog = (kind: 'create-folder' | 'rename', item?: RepositoryItem) => {
    setDialog(kind)
    setDialogItemId(item?.id ?? null)
    setDialogValue(kind === 'rename' && item ? item.name : '')
    setMenuItemId(null)
  }

  const submitDialog = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = dialogValue.trim()
    if (!value) return
    if (dialog === 'create-folder') {
      setItems((current) => [
        {
          id: crypto.randomUUID(),
          name: value,
          type: 'folder',
          parentId: currentFolderId,
          modifiedAt: new Date().toISOString(),
          modifiedBy: 'Alex Morgan',
          size: null,
          favorite: false,
          shared: false,
          recent: true,
          trashed: false,
          tags: [],
        },
        ...current,
      ])
      notify('Folder added to the local demo workspace')
    } else if (dialogItemId) {
      setItems((current) => current.map((item) => item.id === dialogItemId ? { ...item, name: value } : item))
      notify('Name updated in the local demo workspace')
    }
    setDialog(null)
    setDialogValue('')
  }

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length) {
      const uploadedItems: RepositoryItem[] = files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: 'document',
        parentId: currentFolderId,
        modifiedAt: new Date().toISOString(),
        modifiedBy: 'Alex Morgan',
        size: file.size,
        favorite: false,
        shared: false,
        recent: true,
        trashed: false,
        tags: ['New upload'],
      }))
      setItems((current) => [...uploadedItems, ...current])
      notify(`${files.length} file${files.length === 1 ? '' : 's'} added to the local demo list`)
    }
    event.target.value = ''
  }

  const toggleFavorite = (itemId: string) => {
    setItems((current) => current.map((item) => item.id === itemId ? { ...item, favorite: !item.favorite } : item))
  }

  const toggleSelection = (itemId: string) => {
    setSelectedIds((current) => current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId])
  }

  const moveToTrash = (itemId: string) => {
    setItems((current) => current.map((item) => item.id === itemId ? { ...item, trashed: true } : item))
    setSelectedIds((current) => current.filter((id) => id !== itemId))
    if (selectedId === itemId) setSelectedId(null)
    setMenuItemId(null)
    notify('Item moved to trash')
  }

  const restoreFromTrash = (itemId: string) => {
    setItems((current) => current.map((item) => item.id === itemId ? { ...item, trashed: false } : item))
    notify('Item restored')
  }

  return (
    <div className={`app-frame${darkMode ? ' theme-dark' : ''}`}>
      {sidebarOpen && <button type="button" aria-label="Close navigation" className="mobile-scrim" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Files size={19} strokeWidth={2.2} /></div>
          <span className="brand-name">alfresco</span>
          <button type="button" className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        <div className="workspace-switcher">
          <span className="workspace-avatar">N</span>
          <span className="workspace-copy"><strong>Northstar Studio</strong><small>Enterprise workspace</small></span>
          <ChevronDown size={15} />
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-heading">{group.label}</p>
              {group.items.map(({ label, href, icon: Icon }) => (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) => `nav-link${(isActive || (href === '/my-files' && pathname === '/my-files')) ? ' active' : ''}`}
                  onClick={() => { setCurrentFolderId(null); setSidebarOpen(false) }}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{label}</span>
                  {href === '/tasks' && <span className="nav-count">4</span>}
                </NavLink>
              ))}
            </div>
          ))}
          <div className="nav-group">
            <p className="nav-heading">ADMINISTRATION</p>
            {adminNavigation.map(({ label, href, icon: Icon }) => (
              <NavLink key={href} to={href} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="storage-summary">
            <div className="storage-heading"><span>Storage</span><span>68%</span></div>
            <div className="storage-track"><span /></div>
            <small>6.8 GB of 10 GB used</small>
          </div>
          <button type="button" className="nav-link help-link" onClick={() => notify('Help center is not connected in this frontend phase')}><CircleHelp size={17} /><span>Help center</span></button>
          <button type="button" className="account-card" onClick={() => navigate('/profile')}>
            <span className="user-avatar">AM</span>
            <span className="account-copy"><strong>Alex Morgan</strong><small>Workspace admin</small></span>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button type="button" className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="global-search">
            <Search size={17} />
            <input aria-label="Search all content" placeholder="Search files, folders, and people" value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value.trim() && location.pathname !== '/search') navigate('/search') }} />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topbar-actions">
            <button type="button" className="icon-button" aria-label={darkMode ? 'Use light theme' : 'Use dark theme'} onClick={() => setDarkMode((enabled) => !enabled)}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <div className="popover-anchor">
              <button type="button" className="icon-button notification-button" aria-label="Notifications" onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false) }}><Bell size={18} /><span className="notification-dot" /></button>
              {notificationsOpen && <div className="floating-panel notification-panel"><div className="floating-panel-title"><strong>Notifications</strong><span className="unread-label">2 new</span></div><div className="notification-item"><span className="notification-icon teal"><Share2 size={15} /></span><p><strong>Jamie Lee</strong> shared a file with you<small>Quarterly review · 12 min ago</small></p></div><div className="notification-item"><span className="notification-icon blue"><Check size={15} /></span><p><strong>Approval requested</strong> for Vendor agreement<small>Legal team · 1 hour ago</small></p></div><Link to="/notifications" className="panel-footer-button" onClick={() => setNotificationsOpen(false)}>View all notifications</Link></div>}
            </div>
            <button type="button" className="topbar-user" onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false) }}><span className="user-avatar small">AM</span><ChevronDown size={14} /></button>
            {profileOpen && <div className="floating-panel profile-panel"><div className="profile-heading"><span className="user-avatar">AM</span><div><strong>Alex Morgan</strong><small>alex.morgan@northstar.co</small></div></div><Link to="/profile" className="profile-panel-link" onClick={() => setProfileOpen(false)}><UserRound size={16} />Your profile</Link><Link to="/preferences" className="profile-panel-link" onClick={() => setProfileOpen(false)}><Settings2 size={16} />Preferences</Link><Link to="/login" className="profile-panel-link" onClick={() => setProfileOpen(false)}><LogOut size={16} />Sign out</Link></div>}
          </div>
        </header>

        <main className="workspace-main container-fluid">
          <div className="page-toolbar">
            <div className="page-heading-block">
              <div className="breadcrumbs">
                <NavLink to="/overview">Workspace</NavLink><ChevronRight size={14} />
                {pathname === '/my-files' ? <><button type="button" className="breadcrumb-link" onClick={() => setCurrentFolderId(null)}>My Files</button>{folderTrail.map((folder) => <span key={folder.id} className="breadcrumb-current"><ChevronRight size={14} />{folder.name}</span>)}</> : <span className="breadcrumb-current">{title}</span>}
              </div>
              <div className="heading-line"><h1>{pathname === '/my-files' && currentFolder ? currentFolder.name : title}</h1>{pathname === '/my-files' && <span className="access-badge"><UserRound size={13} /> Private</span>}</div>
              <p className="page-subtitle">{pathname === '/my-files' ? 'Manage and organize your personal documents.' : `Your ${title.toLowerCase()} in one place.`}</p>
            </div>
            {pathname === '/my-files' && <div className="primary-actions">
              <button type="button" className="btn btn-outline-secondary create-folder-button" onClick={() => openDialog('create-folder')}><FolderPlus size={16} /><span>New folder</span></button>
              <input ref={fileInputRef} className="visually-hidden" type="file" multiple onChange={handleUpload} />
              <button type="button" className="btn btn-primary upload-button" onClick={() => fileInputRef.current?.click()}><Upload size={16} /><span>Upload files</span></button>
            </div>}
          </div>

          {isOverview ? (
            <Overview items={items} onOpenFiles={() => navigate('/my-files')} />
          ) : isRepositoryView ? (
            <>
              <div className="summary-strip">
                <div><span className="summary-icon blue"><Files size={17} /></span><span><strong>{items.filter((item) => !item.trashed && item.type === 'document').length}</strong><small>Documents</small></span></div>
                <span className="summary-divider" />
                <div><span className="summary-icon teal"><Folder size={17} /></span><span><strong>{items.filter((item) => !item.trashed && item.type === 'folder').length}</strong><small>Folders</small></span></div>
                <span className="summary-divider" />
                <div><span className="summary-icon violet"><Share2 size={16} /></span><span><strong>{items.filter((item) => !item.trashed && item.shared).length}</strong><small>Shared items</small></span></div>
                <div className="summary-updated"><Activity size={15} /><span>Updated just now</span></div>
              </div>

              <section className="file-browser" aria-label={`${title} file list`}>
                <div className="browser-toolbar">
                  <div className="toolbar-left">
                    {selectedIds.length > 0 ? <><span className="selection-count">{selectedIds.length} selected</span><button type="button" className="toolbar-action" onClick={() => { selectedIds.forEach(toggleFavorite); setSelectedIds([]); notify('Favorites updated') }}><Star size={15} />Favorite</button><button type="button" className="toolbar-action danger-action" onClick={() => { selectedIds.forEach(moveToTrash); setSelectedIds([]) }}><Trash2 size={15} />Trash</button></> : <span className="item-count">{visibleItems.length} items</span>}
                  </div>
                  <div className="toolbar-right">
                    <label className="filter-select"><Filter size={15} /><select aria-label="Filter by type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">All items</option><option value="documents">Documents</option><option value="folders">Folders</option></select><ChevronDown size={13} /></label>
                    <div className="view-toggle" role="group" aria-label="View mode"><button type="button" aria-label="List view" className={!gridView ? 'selected' : ''} onClick={() => setGridView(false)}><List size={17} /></button><button type="button" aria-label="Grid view" className={gridView ? 'selected' : ''} onClick={() => setGridView(true)}><LayoutGrid size={16} /></button></div>
                    <button type="button" className={`icon-button properties-toggle${propertiesOpen ? ' selected' : ''}`} aria-label="Toggle details panel" onClick={() => setPropertiesOpen((open) => !open)}><PanelRight size={17} /></button>
                  </div>
                </div>

                <div className={`browser-content${propertiesOpen ? '' : ' no-properties'}`}>
                  <div className="file-list-area">
                    {visibleItems.length === 0 ? (
                      <div className="empty-state"><span className="empty-icon"><Search size={22} /></span><h2>No items found</h2><p>Try another search or adjust your filters.</p><button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setQuery(''); setTypeFilter('all') }}>Clear filters</button></div>
                    ) : gridView ? (
                      <div className="file-grid">{visibleItems.map((item) => <FileCard key={item.id} item={item} selected={selectedId === item.id} onSelect={() => setSelectedId(item.id)} onOpen={() => item.type === 'folder' ? setCurrentFolderId(item.id) : setSelectedId(item.id)} />)}</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table file-table mb-0">
                          <thead><tr><th className="check-column"><input aria-label="Select all visible items" type="checkbox" checked={visibleItems.length > 0 && visibleItems.every((item) => selectedIds.includes(item.id))} onChange={(event) => setSelectedIds(event.target.checked ? visibleItems.map((item) => item.id) : [])} /></th><th>Name</th><th>Modified <CalendarDays size={13} /></th><th>Modified by</th><th>Size</th><th aria-label="Actions" /></tr></thead>
                          <tbody>{visibleItems.map((item) => <tr key={item.id} className={selectedId === item.id ? 'row-selected' : ''} onClick={() => setSelectedId(item.id)}>
                            <td className="check-column" onClick={(event) => event.stopPropagation()}><input aria-label={`Select ${item.name}`} type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelection(item.id)} /></td>
                            <td><div className="file-name-cell"><FileTypeIcon item={item} /><button type="button" className="file-name-button" onClick={(event) => { event.stopPropagation(); if (item.type === 'folder') setCurrentFolderId(item.id); else setSelectedId(item.id) }}>{item.name}</button>{item.shared && <span className="shared-indicator" title="Shared"><UsersRound size={13} /></span>}{item.favorite && <Star className="favorite-indicator" size={13} fill="currentColor" />}</div></td>
                            <td className="muted-cell">{formatDate(item.modifiedAt)}</td><td className="muted-cell">{item.modifiedBy}</td><td className="muted-cell size-cell">{item.type === 'folder' ? '--' : formatSize(item.size)}</td>
                            <td className="row-actions" onClick={(event) => event.stopPropagation()}>{isTrash ? <button type="button" className="icon-button row-action-button" aria-label={`Restore ${item.name}`} onClick={() => restoreFromTrash(item.id)}><History size={16} /></button> : <div className="popover-anchor"><button type="button" className="icon-button row-action-button" aria-label={`More actions for ${item.name}`} onClick={() => setMenuItemId((current) => current === item.id ? null : item.id)}><MoreHorizontal size={17} /></button>{menuItemId === item.id && <div className="row-menu"><button type="button" onClick={() => openDialog('rename', item)}>Rename</button><button type="button" onClick={() => { toggleFavorite(item.id); setMenuItemId(null) }}>{item.favorite ? 'Remove favorite' : 'Add to favorites'}</button><button type="button" className="danger-action" onClick={() => moveToTrash(item.id)}>Move to trash</button></div>}</div>}</td>
                          </tr>)}</tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {propertiesOpen && <PropertiesPanel item={selectedItem} onClose={() => setPropertiesOpen(false)} onFavorite={toggleFavorite} onShare={() => notify('Sharing settings will be connected in the Supabase integration phase')} />}
                </div>
              </section>
            </>
          ) : <section className="module-empty-state"><span className="empty-icon"><Files size={22} /></span><h2>{title}</h2><p>This area is ready for its frontend implementation.</p></section>}
          <footer className="workspace-footer"><span>Alfresco Workspace</span><span>Secure document management <span className="footer-dot">·</span> Demo data stays in this browser session</span></footer>
        </main>
      </div>

      {dialog && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}><form className="dialog-surface" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onSubmit={submitDialog}><div className="dialog-heading"><div><span className="dialog-icon">{dialog === 'create-folder' ? <FolderPlus size={18} /> : <Files size={18} />}</span><h2 id="dialog-title">{dialog === 'create-folder' ? 'Create folder' : 'Rename item'}</h2></div><button type="button" className="icon-button" aria-label="Close dialog" onClick={() => setDialog(null)}><X size={18} /></button></div><label className="form-label" htmlFor="item-name">Name</label><input autoFocus id="item-name" className="form-control" value={dialogValue} onChange={(event) => setDialogValue(event.target.value)} placeholder={dialog === 'create-folder' ? 'e.g. Project documents' : 'Enter a new name'} required maxLength={120} /><div className="dialog-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="btn btn-primary">{dialog === 'create-folder' ? 'Create folder' : 'Save changes'}</button></div></form></div>}
      {toast && <div className="toast-message" role="status"><Check size={16} />{toast}</div>}
    </div>
  )
}

function Overview({ items, onOpenFiles }: { items: RepositoryItem[]; onOpenFiles: () => void }) {
  const activeItems = items.filter((item) => !item.trashed)
  return <section className="overview-page"><div className="overview-welcome"><div><span className="eyebrow">FRIDAY, OCTOBER 24</span><h2>Good morning, Alex</h2><p>Here’s what’s happening across your workspace.</p></div><button type="button" className="btn btn-primary" onClick={onOpenFiles}><Files size={16} />Browse my files</button></div><div className="overview-metrics"><article><span className="metric-icon blue"><Files size={18} /></span><small>My documents</small><strong>{activeItems.filter((item) => item.type === 'document').length}</strong><span className="metric-note">Across your workspace</span></article><article><span className="metric-icon teal"><Share2 size={18} /></span><small>Shared with me</small><strong>{activeItems.filter((item) => item.shared).length}</strong><span className="metric-note">From your colleagues</span></article><article><span className="metric-icon amber"><Check size={18} /></span><small>Pending tasks</small><strong>4</strong><span className="metric-note">2 due this week</span></article><article><span className="metric-icon violet"><HardDrive size={18} /></span><small>Storage used</small><strong>6.8 <em>GB</em></strong><span className="metric-note">of 10 GB available</span></article></div><div className="overview-lower"><section className="activity-section"><div className="section-heading"><div><h3>Recent activity</h3><p>Your latest document updates</p></div><button type="button" className="text-button" onClick={onOpenFiles}>View all</button></div>{activeItems.filter((item) => item.type === 'document').slice(0, 4).map((item) => <div className="activity-row" key={item.id}><FileTypeIcon item={item} /><div><strong>{item.name}</strong><small>{item.modifiedBy} · {formatDate(item.modifiedAt)}</small></div><span className="activity-event">Updated</span></div>)}</section><section className="quick-access"><div className="section-heading"><div><h3>Quick access</h3><p>Jump back into your work</p></div></div><button type="button" onClick={onOpenFiles}><span className="quick-icon blue"><Files size={18} /></span><span><strong>My Files</strong><small>Your personal repository</small></span><ChevronRight size={16} /></button><button type="button" onClick={onOpenFiles}><span className="quick-icon teal"><LibraryBig size={18} /></span><span><strong>Brand library</strong><small>Shared with your team</small></span><ChevronRight size={16} /></button><button type="button" onClick={onOpenFiles}><span className="quick-icon amber"><Workflow size={18} /></span><span><strong>Approval queue</strong><small>4 items need attention</small></span><ChevronRight size={16} /></button></section></div></section>
}

function FileTypeIcon({ item }: { item: RepositoryItem }) {
  if (item.type === 'folder') return <span className="file-type-icon folder-type"><Folder size={18} fill="currentColor" strokeWidth={1.5} /></span>
  const extension = item.name.split('.').pop()?.toLowerCase()
  if (extension === 'xlsx' || extension === 'csv') return <span className="file-type-icon spreadsheet-type"><FileSpreadsheet size={18} /></span>
  if (['png', 'jpg', 'jpeg', 'svg'].includes(extension ?? '')) return <span className="file-type-icon image-type"><FileImage size={18} /></span>
  if (extension === 'pdf') return <span className="file-type-icon pdf-type"><FileText size={18} /></span>
  return <span className="file-type-icon doc-type"><FileText size={18} /></span>
}

function FileCard({ item, selected, onSelect, onOpen }: { item: RepositoryItem; selected: boolean; onSelect: () => void; onOpen: () => void }) {
  return <article className={`file-card${selected ? ' selected' : ''}`}><button type="button" className="card-select" onClick={onSelect} aria-label={`Select ${item.name}`}><FileTypeIcon item={item} /><MoreHorizontal size={18} /></button><button type="button" className="card-name" onClick={onOpen}>{item.name}</button><div className="card-meta"><span>{item.type === 'folder' ? 'Folder' : formatSize(item.size)}</span><span>{formatDate(item.modifiedAt)}</span></div></article>
}

function PropertiesPanel({ item, onClose, onFavorite, onShare }: { item?: RepositoryItem; onClose: () => void; onFavorite: (itemId: string) => void; onShare: () => void }) {
  if (!item) return <aside className="properties-panel"><div className="properties-header"><strong>Details</strong><button type="button" className="icon-button" aria-label="Close details" onClick={onClose}><X size={17} /></button></div><div className="properties-empty"><PanelRight size={22} /><p>Select a file to view its details.</p></div></aside>
  return <aside className="properties-panel"><div className="properties-header"><strong>Details</strong><button type="button" className="icon-button" aria-label="Close details" onClick={onClose}><X size={17} /></button></div><div className="properties-preview"><FileTypeIcon item={item} /><span className="preview-name">{item.name}</span><span className="preview-kind">{item.type === 'folder' ? 'Folder' : `${item.name.split('.').pop()?.toUpperCase() ?? 'FILE'} document`}</span><div className="preview-actions"><button type="button" onClick={() => onFavorite(item.id)}><Star size={15} fill={item.favorite ? 'currentColor' : 'none'} />{item.favorite ? 'Favorited' : 'Favorite'}</button><button type="button" onClick={onShare}><Share2 size={15} />Share</button></div></div><div className="property-section"><h3>Details</h3><Property label="Owner" value={item.modifiedBy} /><Property label="Modified" value={formatDate(item.modifiedAt)} /><Property label="File size" value={item.type === 'folder' ? '--' : formatSize(item.size)} /><Property label="Location" value={item.parentId ? 'My Files / Projects' : 'My Files'} /></div><div className="property-section"><h3>Organization</h3><div className="tag-list">{(item.tags.length ? item.tags : ['No tags']).map((tag) => <span className={tag === 'No tags' ? 'tag-pill muted-tag' : 'tag-pill'} key={tag}>{tag}</span>)}</div></div><div className="property-section"><h3>Access</h3><div className="access-row"><span className="access-avatar">AM</span><span><strong>Alex Morgan</strong><small>Owner</small></span><span className="access-level">Full access</span></div>{item.shared && <div className="access-row"><span className="access-avatar second-avatar">JL</span><span><strong>Jamie Lee</strong><small>Member</small></span><span className="access-level">Can edit</span></div>}</div></aside>
}

function Property({ label, value }: { label: string; value: string }) {
  return <div className="property-row"><span>{label}</span><strong>{value}</strong></div>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function formatSize(value: number | null) {
  if (value === null) return '--'
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

export default function AppRouter() {
  return <Routes>
    <Route path="/login" element={<AuthScreen mode="login" />} />
    <Route path="/register" element={<AuthScreen mode="register" />} />
    <Route path="/forgot-password" element={<AuthScreen mode="recovery" />} />
    <Route path="*" element={<App />} />
  </Routes>
}

type AuthMode = 'login' | 'register' | 'recovery'

function AuthScreen({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const schema = z.object({
    fullName: z.string().optional(),
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string(),
  }).superRefine((values, context) => {
    if (mode === 'register' && (values.fullName?.trim().length ?? 0) < 2) {
      context.addIssue({ code: 'custom', path: ['fullName'], message: 'Enter your full name.' })
    }
    if (mode !== 'recovery' && values.password.length < 8) {
      context.addIssue({ code: 'custom', path: ['password'], message: 'Use at least 8 characters.' })
    }
  })
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '' },
  })
  const heading = mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create your account' : 'Reset your password'
  const description = mode === 'login' ? 'Sign in to continue to your workspace.' : mode === 'register' ? 'Set up your Alfresco workspace account.' : 'We’ll help you get back into your account.'

  return <main className="auth-page">
    <section className="auth-brand-panel">
      <Link to="/login" className="auth-brand"><span className="brand-mark"><Files size={19} strokeWidth={2.2} /></span><span>alfresco</span></Link>
      <div className="auth-brand-message"><span className="auth-kicker">NORTHSTAR STUDIO</span><h1>Every document.<br />In its right place.</h1><p>A thoughtful workspace for your organization’s most important work.</p><div className="auth-feature-row"><span><ShieldCheck size={15} /> Secure by design</span><span><UsersRound size={15} /> Built for teams</span></div></div>
      <div className="auth-brand-footer"><span>© 2026 Alfresco Workspace</span><span>Privacy <span>·</span> Terms</span></div>
    </section>
    <section className="auth-form-panel">
      <div className="auth-form-wrap">
        {mode !== 'login' && <Link to={mode === 'recovery' ? '/login' : '/login'} className="auth-back-link"><ArrowLeft size={15} />Back to sign in</Link>}
        <span className="auth-mobile-brand"><span className="brand-mark"><Files size={18} /></span>alfresco</span>
        <div className="auth-form-heading"><span className="auth-form-eyebrow">{mode === 'recovery' ? 'ACCOUNT RECOVERY' : 'YOUR WORKSPACE AWAITS'}</span><h2>{heading}</h2><p>{description}</p></div>
        <form className="auth-form" onSubmit={handleSubmit(() => { setSubmitted(true) })} noValidate>
          {mode === 'register' && <label className="auth-field"><span>Full name</span><input autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errors.fullName)} {...register('fullName')} />{errors.fullName && <small className="auth-error">{errors.fullName.message}</small>}</label>}
          <label className="auth-field"><span>Work email</span><input type="email" autoComplete="email" placeholder="you@company.com" aria-invalid={Boolean(errors.email)} {...register('email')} />{errors.email && <small className="auth-error">{errors.email.message}</small>}</label>
          {mode !== 'recovery' && <label className="auth-field"><span>Password</span><span className="password-input-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="At least 8 characters" aria-invalid={Boolean(errors.password)} {...register('password')} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>{errors.password && <small className="auth-error">{errors.password.message}</small>}</label>}
          {mode === 'login' && <div className="auth-options"><label><input type="checkbox" /> <span>Remember me</span></label><Link to="/forgot-password">Forgot password?</Link></div>}
          {submitted && <div className="auth-demo-notice" role="status"><ShieldCheck size={16} /><span>Form validated. Supabase Auth will be connected in the integration phase.</span></div>}
          <button type="submit" className="auth-submit" disabled={isSubmitting}>{mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send recovery link'}</button>
        </form>
        {mode === 'login' ? <p className="auth-switch">New to Alfresco? <Link to="/register">Create an account</Link></p> : mode === 'register' ? <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p> : <p className="auth-switch"><Link to="/login">Return to sign in</Link></p>}
        <div className="auth-security-note"><ShieldCheck size={14} /><span>Your organization’s documents stay private and protected.</span></div>
      </div>
    </section>
  </main>
}
