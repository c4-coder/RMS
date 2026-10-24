import { useMemo, useState, type FormEvent } from 'react'
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronDown,
  Database,
  FileClock,
  HardDrive,
  KeyRound,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
} from 'lucide-react'
import { Modal } from '../../components/Modal'
import { PageHeader, StatusBadge } from '../../components/PageHeader'
import { useDemoData } from '../demo/useDemoData'
import { formatDateTime, formatRelative } from '../demo/formatters'
import type { DemoMember } from '../demo/types'

export type AdminView = 'users' | 'roles' | 'audit' | 'storage' | 'settings'

const adminCopy: Record<AdminView, { title: string; description: string }> = {
  users: {
    title: 'Users and groups',
    description: 'Manage workspace membership, invitations, and access roles.',
  },
  roles: {
    title: 'Roles and permissions',
    description: 'Review access templates and the permissions they grant.',
  },
  audit: {
    title: 'Audit logs',
    description:
      'Review a searchable timeline of document and access activity.',
  },
  storage: {
    title: 'Storage and policies',
    description: 'Monitor repository capacity and retention controls.',
  },
  settings: {
    title: 'System settings',
    description:
      'Configure organization-wide defaults for this workspace preview.',
  },
}

export function AdministrationPage({ view }: { view: AdminView }) {
  const { members, setMembers, groups, activity } = useDemoData()
  const [query, setQuery] = useState('')
  const [dialog, setDialog] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Member')
  const [toast, setToast] = useState('')
  const [settings, setSettings] = useState({
    allowExternalSharing: false,
    requireApproval: true,
    retentionNotices: true,
    defaultClassification: true,
  })
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    view: true,
    upload: true,
    edit: true,
    share: true,
    delete: false,
    administer: false,
  })
  const [auditKind, setAuditKind] = useState('all')
  const content = adminCopy[view]
  const filteredMembers = useMemo(
    () =>
      members.filter((member) =>
        `${member.name} ${member.email} ${member.department} ${member.role}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [members, query],
  )
  const filteredAudit = useMemo(
    () =>
      activity.filter(
        (entry) =>
          (auditKind === 'all' || entry.kind === auditKind) &&
          `${entry.actor} ${entry.action} ${entry.target}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [activity, auditKind, query],
  )

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  const inviteUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !email.trim()) return
    const invite: DemoMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      role,
      department: 'Unassigned',
      status: 'Invited',
      lastActive: 'Invitation pending',
    }
    setMembers((current) => [invite, ...current])
    setName('')
    setEmail('')
    setDialog(false)
    notify(`Invitation prepared for ${invite.email} (local demo only)`)
  }

  const copy = (value: string) => {
    setSettings((current) => ({
      ...current,
      [value]: !current[value as keyof typeof current],
    }))
  }

  return (
    <div className="feature-page admin-page">
      <PageHeader
        eyebrow="ADMINISTRATION"
        title={content.title}
        description={content.description}
        action={
          view === 'users' && (
            <button
              type="button"
              className="btn btn-primary page-action-button"
              onClick={() => setDialog(true)}
            >
              <Plus size={15} />
              Invite user
            </button>
          )
        }
      />
      {view === 'users' && (
        <>
          <div className="admin-metric-strip">
            <span>
              <strong>
                {members.filter((member) => member.status === 'Active').length}
              </strong>
              <small>Active users</small>
            </span>
            <span>
              <strong>
                {members.filter((member) => member.status === 'Invited').length}
              </strong>
              <small>Invitations pending</small>
            </span>
            <span>
              <strong>{groups.length}</strong>
              <small>Groups</small>
            </span>
            <span>
              <strong>96%</strong>
              <small>License utilization</small>
            </span>
          </div>
          <section className="admin-card">
            <div className="admin-card-toolbar">
              <div>
                <h2>Workspace members</h2>
                <p>People with access to Northstar Studio</p>
              </div>
              <label className="admin-search">
                <Search size={15} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search members"
                />
              </label>
            </div>
            <div className="table-responsive">
              <table className="table feature-table admin-table mb-0">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last active</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="admin-member-cell">
                          <span className="admin-avatar">
                            {member.name
                              .split(' ')
                              .map((part) => part[0])
                              .join('')}
                          </span>
                          <span>
                            <strong>{member.name}</strong>
                            <small>{member.email}</small>
                          </span>
                        </div>
                      </td>
                      <td>{member.department}</td>
                      <td>
                        <select
                          className="role-inline-select"
                          aria-label={`Role for ${member.name}`}
                          value={member.role}
                          onChange={(event) =>
                            setMembers((current) =>
                              current.map((entry) =>
                                entry.id === member.id
                                  ? { ...entry, role: event.target.value }
                                  : entry,
                              ),
                            )
                          }
                        >
                          <option>Workspace admin</option>
                          <option>Content editor</option>
                          <option>Approver</option>
                          <option>Records manager</option>
                          <option>Member</option>
                          <option>Viewer</option>
                        </select>
                      </td>
                      <td>
                        <StatusBadge status={member.status} />
                      </td>
                      <td>{member.lastActive}</td>
                      <td>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`More actions for ${member.name}`}
                          onClick={() => {
                            if (member.status === 'Suspended')
                              setMembers((current) =>
                                current.map((entry) =>
                                  entry.id === member.id
                                    ? { ...entry, status: 'Active' }
                                    : entry,
                                ),
                              )
                            else if (member.id !== 'member-alex')
                              setMembers((current) =>
                                current.map((entry) =>
                                  entry.id === member.id
                                    ? { ...entry, status: 'Suspended' }
                                    : entry,
                                ),
                              )
                            notify(
                              member.status === 'Suspended'
                                ? 'Member reactivated'
                                : member.id === 'member-alex'
                                  ? 'You cannot suspend your own demo account'
                                  : 'Member access suspended',
                            )
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <div className="admin-note">
            <ShieldCheck size={15} />
            <span>
              Role changes update this preview only. Backend authorization and
              invitations require Supabase policies and server-side checks.
            </span>
          </div>
        </>
      )}

      {view === 'roles' && (
        <div className="roles-layout">
          <div className="role-cards-grid">
            {[
              {
                name: 'Workspace admin',
                members: 1,
                color: 'violet',
                description:
                  'Full control over settings, content, access, and policies.',
              },
              {
                name: 'Content editor',
                members: 8,
                color: 'blue',
                description:
                  'Create and update content, folders, and shared metadata.',
              },
              {
                name: 'Approver',
                members: 4,
                color: 'teal',
                description:
                  'Review, comment, and approve workflow submissions.',
              },
              {
                name: 'Viewer',
                members: 6,
                color: 'amber',
                description:
                  'Read and download content shared with their role.',
              },
            ].map((item) => (
              <article className="role-card" key={item.name}>
                <span className={`role-card-icon role-${item.color}`}>
                  <ShieldCheck size={17} />
                </span>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <span className="role-member-count">
                  <UsersRound size={14} />
                  {item.members} members
                </span>
                <button
                  type="button"
                  onClick={() =>
                    notify(`${item.name} permissions are shown in the matrix`)
                  }
                >
                  View permissions
                </button>
              </article>
            ))}
          </div>
          <section className="admin-card permission-card">
            <div className="admin-card-toolbar">
              <div>
                <h2>Permission matrix</h2>
                <p>
                  Role capabilities. Toggle the admin preview column to explore
                  changes.
                </p>
              </div>
              <StatusBadge status="Policy preview" />
            </div>
            <div className="table-responsive">
              <table className="table feature-table permission-table mb-0">
                <thead>
                  <tr>
                    <th>Permission</th>
                    <th>Viewer</th>
                    <th>Approver</th>
                    <th>Content editor</th>
                    <th>Workspace admin</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['View documents', 'view'],
                    ['Upload documents', 'upload'],
                    ['Edit metadata', 'edit'],
                    ['Share content', 'share'],
                    ['Delete documents', 'delete'],
                    ['Manage workspace', 'administer'],
                  ].map(([label, key]) => (
                    <tr key={key}>
                      <td>{label}</td>
                      {[
                        'Viewer',
                        'Approver',
                        'Content editor',
                        'Workspace admin',
                      ].map((roleName, index) => {
                        const presetGranted =
                          key === 'view' ||
                          (key === 'upload' && index >= 2) ||
                          (key === 'edit' && index >= 2) ||
                          (key === 'share' && index >= 1) ||
                          (key === 'delete' && index === 3) ||
                          (key === 'administer' && index === 3)
                        const granted =
                          index === 3 ? permissions[key] : presetGranted
                        return (
                          <td key={roleName}>
                            {index === 3 ? (
                              <button
                                type="button"
                                className={
                                  granted
                                    ? 'permission-control permission-yes'
                                    : 'permission-control permission-no'
                                }
                                aria-label={`${label} for ${roleName}: ${granted ? 'enabled' : 'disabled'}`}
                                aria-pressed={granted}
                                onClick={() =>
                                  setPermissions((current) => ({
                                    ...current,
                                    [key]: !current[key],
                                  }))
                                }
                              >
                                {granted ? <Check size={15} /> : '—'}
                              </button>
                            ) : (
                              <span
                                className={
                                  granted ? 'permission-yes' : 'permission-no'
                                }
                              >
                                {granted ? <Check size={15} /> : '—'}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {view === 'audit' && (
        <>
          <div className="audit-filter-bar">
            <label className="admin-search">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search actors or content"
              />
            </label>
            <label className="admin-filter">
              <Activity size={14} />
              <select
                value={auditKind}
                onChange={(event) => setAuditKind(event.target.value)}
              >
                <option value="all">All events</option>
                <option value="upload">Uploads</option>
                <option value="edit">Edits</option>
                <option value="share">Sharing</option>
                <option value="approval">Approvals</option>
                <option value="comment">Comments</option>
              </select>
              <ChevronDown size={13} />
            </label>
            <button
              type="button"
              className="btn btn-outline-secondary page-action-button"
              onClick={() =>
                notify('Audit report prepared for this local preview')
              }
            >
              <FileClock size={15} />
              Export report
            </button>
          </div>
          <section className="admin-card audit-card">
            <div className="admin-card-toolbar">
              <div>
                <h2>Activity log</h2>
                <p>
                  Showing {filteredAudit.length} of {activity.length} sample
                  events
                </p>
              </div>
              <span className="audit-range-label">OCT 18 – OCT 24, 2026</span>
            </div>
            {filteredAudit.length === 0 ? (
              <div className="feature-empty">
                <Activity size={24} />
                <h3>No matching events</h3>
                <p>Adjust your filters to review more activity.</p>
              </div>
            ) : (
              <div className="audit-event-list">
                {filteredAudit.map((event) => (
                  <article className="audit-event-row" key={event.id}>
                    <span className={`audit-event-icon audit-${event.kind}`}>
                      {event.kind === 'share' ? (
                        <UsersRound size={16} />
                      ) : event.kind === 'approval' ? (
                        <ShieldCheck size={16} />
                      ) : event.kind === 'upload' ? (
                        <Database size={16} />
                      ) : (
                        <FileClock size={16} />
                      )}
                    </span>
                    <div>
                      <strong>
                        {event.actor} <span>{event.action}</span> {event.target}
                      </strong>
                      <small>
                        {formatDateTime(event.createdAt)} ·{' '}
                        {formatRelative(event.createdAt)}
                      </small>
                    </div>
                    <StatusBadge status="Recorded" />
                  </article>
                ))}
              </div>
            )}
          </section>
          <div className="admin-note">
            <ShieldCheck size={15} />
            <span>
              This sample log is illustrative. Production audit records must be
              append-only and written by trusted backend operations.
            </span>
          </div>
        </>
      )}

      {view === 'storage' && (
        <div className="storage-admin-layout">
          <section className="admin-card storage-overview-card">
            <div className="admin-card-toolbar">
              <div>
                <h2>Storage overview</h2>
                <p>Current organization usage and capacity</p>
              </div>
              <StatusBadge status="Healthy" />
            </div>
            <div className="storage-total">
              <div>
                <span>
                  6.8 <em>GB</em>
                </span>
                <small>of 10 GB used</small>
              </div>
              <HardDrive size={24} />
            </div>
            <div className="storage-large-track">
              <span />
            </div>
            <div className="storage-breakdown">
              <div>
                <span className="breakdown-color docs-color" />
                <span>Documents</span>
                <strong>4.3 GB</strong>
              </div>
              <div>
                <span className="breakdown-color versions-color" />
                <span>Version history</span>
                <strong>1.7 GB</strong>
              </div>
              <div>
                <span className="breakdown-color preview-color" />
                <span>Previews and renditions</span>
                <strong>0.8 GB</strong>
              </div>
            </div>
          </section>
          <section className="admin-card retention-policy-card">
            <div className="admin-card-toolbar">
              <div>
                <h2>Retention policies</h2>
                <p>Lifecycle rules by classification</p>
              </div>
              <button
                type="button"
                className="subtle-icon-button"
                onClick={() =>
                  notify('Retention policy editor is a frontend preview')
                }
              >
                <Settings2 size={16} />
              </button>
            </div>
            {[
              {
                name: 'Public content',
                retention: '3 years',
                description: 'Review before removal',
                status: 'Active',
              },
              {
                name: 'Internal records',
                retention: '7 years',
                description: 'Archive at end of active use',
                status: 'Active',
              },
              {
                name: 'Restricted records',
                retention: 'Permanent',
                description: 'Legal hold eligible',
                status: 'Protected',
              },
            ].map((policy) => (
              <div className="retention-policy-row" key={policy.name}>
                <span className="policy-shield">
                  <ShieldCheck size={15} />
                </span>
                <span>
                  <strong>{policy.name}</strong>
                  <small>{policy.description}</small>
                </span>
                <span className="policy-retention">{policy.retention}</span>
                <StatusBadge status={policy.status} />
              </div>
            ))}
          </section>
          <section className="storage-policy-note">
            <AlertTriangle size={17} />
            <div>
              <strong>Important storage note</strong>
              <p>
                Actual binary storage, integrity checks, and coordinated
                database backups are not configured in this frontend phase.
              </p>
            </div>
          </section>
        </div>
      )}

      {view === 'settings' && (
        <div className="system-settings-layout">
          <section className="admin-card settings-section">
            <div className="admin-card-toolbar">
              <div>
                <h2>Security and sharing</h2>
                <p>Set organization defaults for repository access.</p>
              </div>
              <KeyRound size={18} />
            </div>
            <AdminToggle
              title="Allow external sharing"
              description="Permit members to share documents outside the organization."
              checked={settings.allowExternalSharing}
              onChange={() => copy('allowExternalSharing')}
            />
            <AdminToggle
              title="Require approval for public links"
              description="Route public link requests through a workspace approver."
              checked={settings.requireApproval}
              onChange={() => copy('requireApproval')}
            />
            <AdminToggle
              title="Notify on retention changes"
              description="Record a notice when document retention is updated."
              checked={settings.retentionNotices}
              onChange={() => copy('retentionNotices')}
            />
          </section>
          <section className="admin-card settings-section">
            <div className="admin-card-toolbar">
              <div>
                <h2>Repository defaults</h2>
                <p>Applied to newly created content in the preview.</p>
              </div>
              <SlidersHorizontal size={18} />
            </div>
            <AdminToggle
              title="Apply default classification"
              description="New documents start with an Internal classification."
              checked={settings.defaultClassification}
              onChange={() => copy('defaultClassification')}
            />
            <label className="settings-select-label">
              Default retention
              <select defaultValue="7 years">
                <option>3 years</option>
                <option>5 years</option>
                <option>7 years</option>
                <option>Permanent</option>
              </select>
            </label>
            <label className="settings-select-label">
              Default time zone
              <select defaultValue="America/New_York">
                <option value="America/New_York">Eastern Time</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">London</option>
              </select>
            </label>
          </section>
          <div className="admin-note">
            <ShieldCheck size={15} />
            <span>
              Settings are in-memory preview controls and reset when the page
              reloads. Enforce critical policies on the backend.
            </span>
          </div>
        </div>
      )}

      <Modal
        open={dialog}
        title="Invite a workspace member"
        description="Add a person to the Northstar Studio demo workspace."
        onClose={() => setDialog(false)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setDialog(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="invite-member-form"
              className="btn btn-primary"
            >
              Prepare invitation
            </button>
          </>
        }
      >
        <form
          className="feature-form"
          id="invite-member-form"
          onSubmit={inviteUser}
        >
          <label>
            Full name
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label>
            Work email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Workspace role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option>Member</option>
              <option>Content editor</option>
              <option>Approver</option>
              <option>Records manager</option>
              <option>Viewer</option>
            </select>
          </label>
        </form>
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

function AdminToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="admin-toggle">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-track" />
    </label>
  )
}
