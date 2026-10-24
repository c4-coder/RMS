import { useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  FileText,
  FolderKanban,
  LibraryBig,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Modal } from '../../components/Modal'
import { PageHeader, StatusBadge } from '../../components/PageHeader'
import { useDemoData } from '../demo/useDemoData'
import type { DemoLibrary, DemoWorkspace } from '../demo/types'

export function OrganizationPage({
  view,
}: {
  view: 'workspaces' | 'libraries'
}) {
  const { workspaces, setWorkspaces, libraries, setLibraries } = useDemoData()
  const [query, setQuery] = useState('')
  const [dialog, setDialog] = useState<'create' | 'details' | null>(null)
  const [workspaceName, setWorkspaceName] = useState('')
  const [workspaceDescription, setWorkspaceDescription] = useState('')
  const [workspaceSelection, setWorkspaceSelection] = useState(
    workspaces[0]?.id ?? '',
  )
  const [libraryName, setLibraryName] = useState('')
  const [libraryDescription, setLibraryDescription] = useState('')
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<DemoWorkspace | null>(null)
  const [selectedLibrary, setSelectedLibrary] = useState<DemoLibrary | null>(
    null,
  )
  const [toast, setToast] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleWorkspaces = useMemo(
    () =>
      workspaces.filter((workspace) =>
        `${workspace.name} ${workspace.description}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    [normalizedQuery, workspaces],
  )
  const visibleLibraries = useMemo(
    () =>
      libraries.filter((library) =>
        `${library.name} ${library.description} ${workspaces.find((workspace) => workspace.id === library.workspaceId)?.name ?? ''}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    [libraries, normalizedQuery, workspaces],
  )

  const createWorkspace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!workspaceName.trim()) return
    setWorkspaces((current) => [
      {
        id: crypto.randomUUID(),
        name: workspaceName.trim(),
        description: workspaceDescription.trim(),
        libraryCount: 0,
        memberCount: 1,
        documentCount: 0,
        color: 'blue',
        role: 'Owner',
      },
      ...current,
    ])
    setWorkspaceName('')
    setWorkspaceDescription('')
    setDialog(null)
    notify('Workspace created in this browser session')
  }

  const createLibrary = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!libraryName.trim() || !workspaceSelection) return
    const record: DemoLibrary = {
      id: crypto.randomUUID(),
      name: libraryName.trim(),
      workspaceId: workspaceSelection,
      description: libraryDescription.trim(),
      documentCount: 0,
      classification: 'Internal',
      retention: '7 years',
    }
    setLibraries((current) => [record, ...current])
    setWorkspaces((current) =>
      current.map((workspace) =>
        workspace.id === workspaceSelection
          ? { ...workspace, libraryCount: workspace.libraryCount + 1 }
          : workspace,
      ),
    )
    setLibraryName('')
    setLibraryDescription('')
    setDialog(null)
    notify('Library created in this browser session')
  }

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  const isWorkspaceView = view === 'workspaces'

  return (
    <div className="feature-page organization-page">
      <PageHeader
        eyebrow="ORGANIZATION"
        title={isWorkspaceView ? 'Workspaces' : 'Document libraries'}
        description={
          isWorkspaceView
            ? 'Organize teams and content around the work that matters.'
            : 'Browse governed document collections across your organization.'
        }
        action={
          <button
            type="button"
            className="btn btn-primary page-action-button"
            onClick={() => {
              setDialog('create')
              setWorkspaceName('')
            }}
          >
            <Plus size={15} />
            {isWorkspaceView ? 'New workspace' : 'New library'}
          </button>
        }
      />
      <div className="organization-insight-row">
        <div>
          <span className="organization-insight-icon blue">
            <Building2 size={18} />
          </span>
          <span>
            <strong>{workspaces.length}</strong>
            <small>Workspaces</small>
          </span>
        </div>
        <div>
          <span className="organization-insight-icon teal">
            <LibraryBig size={18} />
          </span>
          <span>
            <strong>{libraries.length}</strong>
            <small>Libraries</small>
          </span>
        </div>
        <div>
          <span className="organization-insight-icon violet">
            <FileText size={18} />
          </span>
          <span>
            <strong>
              {workspaces
                .reduce((sum, workspace) => sum + workspace.documentCount, 0)
                .toLocaleString()}
            </strong>
            <small>Managed documents</small>
          </span>
        </div>
        <div>
          <span className="organization-insight-icon amber">
            <UsersRound size={18} />
          </span>
          <span>
            <strong>
              {workspaces.reduce(
                (sum, workspace) => sum + workspace.memberCount,
                0,
              )}
            </strong>
            <small>Workspace memberships</small>
          </span>
        </div>
      </div>
      <div className="organization-list-toolbar">
        <div className="organization-tabs">
          <Link className={isWorkspaceView ? 'active' : ''} to="/workspaces">
            <Building2 size={15} />
            Workspaces
          </Link>
          <Link className={!isWorkspaceView ? 'active' : ''} to="/libraries">
            <LibraryBig size={15} />
            Libraries
          </Link>
        </div>
        <label className="organization-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              isWorkspaceView ? 'Find a workspace' : 'Find a library'
            }
          />
        </label>
      </div>

      {isWorkspaceView ? (
        visibleWorkspaces.length === 0 ? (
          <div className="feature-empty">
            <Building2 size={24} />
            <h3>No workspaces found</h3>
            <p>Try a different name or create a workspace.</p>
          </div>
        ) : (
          <div className="workspace-card-grid">
            {visibleWorkspaces.map((workspace) => (
              <article
                className="organization-workspace-card"
                key={workspace.id}
              >
                <div className="workspace-card-top">
                  <span
                    className={`organization-workspace-icon mark-${workspace.color}`}
                  >
                    <FolderKanban size={20} />
                  </span>
                  <button
                    type="button"
                    className="subtle-icon-button"
                    aria-label={`Open ${workspace.name}`}
                    onClick={() => {
                      setSelectedWorkspace(workspace)
                      setDialog('details')
                    }}
                  >
                    <Settings2 size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  className="organization-card-title"
                  onClick={() => {
                    setSelectedWorkspace(workspace)
                    setDialog('details')
                  }}
                >
                  {workspace.name}
                  <ArrowRight size={15} />
                </button>
                <p>{workspace.description}</p>
                <div className="workspace-card-metrics">
                  <span>
                    <FileText size={14} />
                    {workspace.documentCount.toLocaleString()} docs
                  </span>
                  <span>
                    <UsersRound size={14} />
                    {workspace.memberCount} members
                  </span>
                  <span>
                    <LibraryBig size={14} />
                    {workspace.libraryCount} libraries
                  </span>
                </div>
                <div className="workspace-card-footer">
                  <StatusBadge status={workspace.role} />
                  <Link to="/libraries">
                    Browse libraries <ChevronRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )
      ) : visibleLibraries.length === 0 ? (
        <div className="feature-empty">
          <LibraryBig size={24} />
          <h3>No libraries found</h3>
          <p>Try a different name or create a library.</p>
        </div>
      ) : (
        <div className="library-table-wrap">
          <table className="table feature-table library-table mb-0">
            <thead>
              <tr>
                <th>Library</th>
                <th>Workspace</th>
                <th>Documents</th>
                <th>Classification</th>
                <th>Retention</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleLibraries.map((library) => {
                const workspace = workspaces.find(
                  (item) => item.id === library.workspaceId,
                )
                return (
                  <tr
                    key={library.id}
                    onClick={() => {
                      setSelectedLibrary(library)
                      setDialog('details')
                    }}
                  >
                    <td>
                      <div className="library-name-cell">
                        <span className="library-row-icon">
                          <LibraryBig size={17} />
                        </span>
                        <span>
                          <strong>{library.name}</strong>
                          <small>{library.description}</small>
                        </span>
                      </div>
                    </td>
                    <td>{workspace?.name ?? 'Workspace'}</td>
                    <td>{library.documentCount.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={library.classification} />
                    </td>
                    <td>{library.retention}</td>
                    <td>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`View ${library.name}`}
                      >
                        <ArrowRight size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={dialog === 'create' && isWorkspaceView}
        title="Create workspace"
        description="Set up a shared space for a team, project, or business unit."
        onClose={() => setDialog(null)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setDialog(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="org-create-workspace"
              className="btn btn-primary"
            >
              Create workspace
            </button>
          </>
        }
      >
        <form
          id="org-create-workspace"
          className="feature-form"
          onSubmit={createWorkspace}
        >
          <label>
            Workspace name
            <input
              autoFocus
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="e.g. Customer success"
              maxLength={100}
              required
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={workspaceDescription}
              onChange={(event) => setWorkspaceDescription(event.target.value)}
              placeholder="What will this workspace be used for?"
            />
          </label>
          <label>
            Visibility
            <select defaultValue="Private">
              <option>Private</option>
              <option>Organization-wide</option>
            </select>
          </label>
        </form>
      </Modal>
      <Modal
        open={dialog === 'create' && !isWorkspaceView}
        title="Create document library"
        description="Choose the workspace that will own this library."
        onClose={() => setDialog(null)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setDialog(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="org-create-library"
              className="btn btn-primary"
            >
              Create library
            </button>
          </>
        }
      >
        <form
          id="org-create-library"
          className="feature-form"
          onSubmit={createLibrary}
        >
          <label>
            Library name
            <input
              autoFocus
              value={libraryName}
              onChange={(event) => setLibraryName(event.target.value)}
              placeholder="e.g. Project records"
              required
            />
          </label>
          <label>
            Workspace
            <select
              value={workspaceSelection}
              onChange={(event) => setWorkspaceSelection(event.target.value)}
            >
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={libraryDescription}
              onChange={(event) => setLibraryDescription(event.target.value)}
            />
          </label>
          <label>
            Default classification
            <select defaultValue="Internal">
              <option>Public</option>
              <option>Internal</option>
              <option>Confidential</option>
              <option>Restricted</option>
            </select>
          </label>
        </form>
      </Modal>
      <Modal
        open={dialog === 'details' && Boolean(selectedWorkspace)}
        title={selectedWorkspace?.name ?? 'Workspace details'}
        description="Workspace membership and content summary."
        onClose={() => setDialog(null)}
        footer={
          <>
            <Link
              className="btn btn-outline-secondary"
              to="/admin/users"
              onClick={() => setDialog(null)}
            >
              Manage members
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setDialog(null)}
            >
              Done
            </button>
          </>
        }
      >
        <div className="workspace-detail-panel">
          <p>{selectedWorkspace?.description}</p>
          <div className="workspace-detail-stats">
            <span>
              <strong>{selectedWorkspace?.documentCount}</strong>
              <small>Documents</small>
            </span>
            <span>
              <strong>{selectedWorkspace?.libraryCount}</strong>
              <small>Libraries</small>
            </span>
            <span>
              <strong>{selectedWorkspace?.memberCount}</strong>
              <small>Members</small>
            </span>
          </div>
          <h3>Access</h3>
          <p>
            Your role:{' '}
            <StatusBadge status={selectedWorkspace?.role ?? 'Member'} />
          </p>
          <div className="workspace-access-list">
            <span>AM</span>
            <span>Alex Morgan</span>
            <strong>Workspace admin</strong>
            <span>JL</span>
            <span>Jamie Lee</span>
            <strong>Content editor</strong>
            <span>PS</span>
            <span>Priya Shah</span>
            <strong>Approver</strong>
          </div>
        </div>
      </Modal>
      <Modal
        open={dialog === 'details' && Boolean(selectedLibrary)}
        title={selectedLibrary?.name ?? 'Library details'}
        description="Library controls and governance metadata."
        onClose={() => setDialog(null)}
      >
        <div className="workspace-detail-panel">
          <p>{selectedLibrary?.description}</p>
          <div className="metadata-line">
            <span>Workspace</span>
            <strong>
              {
                workspaces.find(
                  (workspace) => workspace.id === selectedLibrary?.workspaceId,
                )?.name
              }
            </strong>
          </div>
          <div className="metadata-line">
            <span>Documents</span>
            <strong>{selectedLibrary?.documentCount.toLocaleString()}</strong>
          </div>
          <div className="metadata-line">
            <span>Classification</span>
            <strong>{selectedLibrary?.classification}</strong>
          </div>
          <div className="metadata-line">
            <span>Retention</span>
            <strong>{selectedLibrary?.retention}</strong>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() =>
              notify(
                'Library policy editor is part of the next administration pass',
              )
            }
          >
            <ShieldCheck size={14} />
            Manage policy
          </button>
        </div>
      </Modal>
      {toast && (
        <div className="toast-message" role="status">
          <Check size={15} />
          {toast}
        </div>
      )}
    </div>
  )
}
