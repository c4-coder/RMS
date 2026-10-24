import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  FileText,
  HardDrive,
  Share2,
  Upload,
  UsersRound,
  Workflow,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge } from '../../components/PageHeader'
import { useDemoData } from '../demo/useDemoData'
import { formatBytes, formatRelative } from '../demo/formatters'

export function DashboardPage() {
  const { items, tasks, activity, notifications, workspaces } = useDemoData()
  const activeDocuments = items.filter(
    (item) => item.kind === 'document' && !item.trashed,
  )
  const pendingTasks = tasks.filter((task) => task.state !== 'Completed')
  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length
  const totalStorage = 10 * 1024 * 1024 * 1024
  const usedStorage = 6.8 * 1024 * 1024 * 1024

  return (
    <div className="feature-page dashboard-page">
      <PageHeader
        eyebrow="FRIDAY, OCTOBER 24, 2026"
        title="Good morning, Alex"
        description="Your workspace is in good shape. Here’s what needs your attention."
        action={
          <Link to="/my-files" className="btn btn-primary page-action-button">
            <Upload size={15} /> Upload document
          </Link>
        }
      />

      <div className="dashboard-stat-grid">
        <article className="dashboard-stat">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon stat-blue">
              <FileText size={18} />
            </span>
            <span className="stat-change positive">
              <ArrowUpRight size={13} />
              12.4%
            </span>
          </div>
          <small>Documents you own</small>
          <strong>
            {
              activeDocuments.filter((item) => item.owner === 'Alex Morgan')
                .length
            }
          </strong>
          <span className="stat-footnote">Across your demo repository</span>
        </article>
        <article className="dashboard-stat">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon stat-teal">
              <Share2 size={18} />
            </span>
            <span className="stat-change positive">
              <ArrowUpRight size={13} />
              8.2%
            </span>
          </div>
          <small>Shared with you</small>
          <strong>
            {items.filter((item) => item.shared && !item.trashed).length}
          </strong>
          <span className="stat-footnote">
            Across {workspaces.length} workspaces
          </span>
        </article>
        <article className="dashboard-stat">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon stat-amber">
              <Workflow size={18} />
            </span>
            <span className="stat-change quiet">
              <Clock3 size={13} />
              {pendingTasks.length} due soon
            </span>
          </div>
          <small>Tasks requiring action</small>
          <strong>{pendingTasks.length}</strong>
          <span className="stat-footnote">
            {tasks.filter((task) => task.state === 'Overdue').length} overdue ·{' '}
            {unreadCount} unread alerts
          </span>
        </article>
        <article className="dashboard-stat storage-stat">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon stat-violet">
              <HardDrive size={18} />
            </span>
            <span className="stat-change quiet">68% used</span>
          </div>
          <small>Workspace storage</small>
          <strong>
            6.8 <em>GB</em>
          </strong>
          <div
            className="storage-progress"
            role="progressbar"
            aria-valuenow={68}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span />
          </div>
          <span className="stat-footnote">
            {formatBytes(totalStorage - usedStorage)} available
          </span>
        </article>
      </div>

      <div className="dashboard-section-grid">
        <section className="dashboard-panel attention-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">YOUR WORK QUEUE</span>
              <h2>Needs your attention</h2>
            </div>
            <Link to="/tasks" className="panel-link">
              All tasks <ArrowRight size={14} />
            </Link>
          </div>
          <div className="attention-summary">
            <span className="attention-number">{pendingTasks.length}</span>
            <span>items are waiting for you</span>
            <span className="attention-separator" />
            <span className="overdue-text">
              {tasks.filter((task) => task.state === 'Overdue').length} overdue
            </span>
          </div>
          <div className="dashboard-task-list">
            {pendingTasks.slice(0, 4).map((task) => (
              <Link
                to={task.kind === 'Approval' ? '/approvals' : '/tasks'}
                className="dashboard-task-row"
                key={task.id}
              >
                <span
                  className={`task-kind-icon task-${task.kind.toLowerCase()}`}
                >
                  {task.kind === 'Approval' ? (
                    <Check size={16} />
                  ) : task.kind === 'Review' ? (
                    <FileText size={16} />
                  ) : (
                    <Clock3 size={16} />
                  )}
                </span>
                <span className="dashboard-task-copy">
                  <strong>{task.title}</strong>
                  <small>
                    {task.documentName} · {task.requester}
                  </small>
                </span>
                <span className="task-due-label">
                  {task.state === 'Overdue'
                    ? 'Overdue'
                    : `Due ${formatRelative(task.dueAt)}`}
                </span>
                <ArrowRight size={14} className="task-arrow" />
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-panel activity-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">ACROSS YOUR WORKSPACE</span>
              <h2>Recent activity</h2>
            </div>
            <Link to="/workflow-history" className="panel-link">
              Activity log <ArrowRight size={14} />
            </Link>
          </div>
          <div className="activity-feed">
            {activity.slice(0, 5).map((entry) => (
              <div className="activity-feed-row" key={entry.id}>
                <span className={`activity-avatar activity-${entry.kind}`}>
                  {entry.actor
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <p>
                  <strong>{entry.actor}</strong> {entry.action}{' '}
                  <b>{entry.target}</b>
                  <small>{formatRelative(entry.createdAt)}</small>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel workspace-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">YOUR ORGANIZATION</span>
              <h2>Workspaces</h2>
            </div>
            <Link to="/workspaces" className="panel-link">
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dashboard-workspace-list">
            {workspaces.slice(0, 3).map((workspace) => (
              <Link
                to="/workspaces"
                className="dashboard-workspace-row"
                key={workspace.id}
              >
                <span
                  className={`workspace-color-mark mark-${workspace.color}`}
                >
                  <UsersRound size={16} />
                </span>
                <span className="dashboard-workspace-copy">
                  <strong>{workspace.name}</strong>
                  <small>
                    {workspace.documentCount} documents ·{' '}
                    {workspace.memberCount} members
                  </small>
                </span>
                <StatusBadge status={workspace.role} />
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-panel quick-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">SHORTCUTS</span>
              <h2>Quick access</h2>
            </div>
          </div>
          <div className="dashboard-quick-links">
            <Link to="/recent">
              <Clock3 size={16} />
              <span>
                <strong>Recently opened</strong>
                <small>Pick up where you left off</small>
              </span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/favorites">
              <Check size={16} />
              <span>
                <strong>Favorites</strong>
                <small>
                  {items.filter((item) => item.starred && !item.trashed).length}{' '}
                  saved items
                </small>
              </span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/shared">
              <Share2 size={16} />
              <span>
                <strong>Shared with me</strong>
                <small>Documents from your team</small>
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
      <div className="dashboard-footer-note">
        <span>
          <Check size={14} /> All systems operational
        </span>
        <span>Data shown is local demo content</span>
      </div>
    </div>
  )
}
