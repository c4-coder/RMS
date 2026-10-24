import { useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Check,
  CheckCheck,
  Clock3,
  FileCheck2,
  FileText,
  Filter,
  History,
  MessageSquareText,
  Search,
  ShieldCheck,
  Workflow as WorkflowIcon,
  X,
} from 'lucide-react'
import { Modal } from '../../components/Modal'
import { PageHeader, StatusBadge } from '../../components/PageHeader'
import { useDemoData } from '../demo/useDemoData'
import { formatDate, formatDateTime, formatRelative } from '../demo/formatters'
import type { DemoTask, TaskState } from '../demo/types'

type WorkflowView = 'tasks' | 'approvals' | 'history'

const pageText: Record<WorkflowView, { title: string; description: string }> = {
  tasks: {
    title: 'My tasks',
    description: 'Review, approve, and complete work assigned to you.',
  },
  approvals: {
    title: 'Approvals',
    description: 'Track document decisions and approval requests.',
  },
  history: {
    title: 'Workflow history',
    description: 'A complete record of recent workflow outcomes.',
  },
}

export function WorkflowPage({ view }: { view: WorkflowView }) {
  const { tasks, setTasks } = useDemoData()
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [selected, setSelected] = useState<DemoTask | null>(null)
  const [comment, setComment] = useState('')
  const [feedback, setFeedback] = useState('')
  const source =
    view === 'approvals'
      ? tasks.filter((task) => task.kind === 'Approval')
      : view === 'history'
        ? tasks.filter((task) => task.state === 'Completed')
        : tasks
  const rows = useMemo(
    () =>
      source
        .filter((task) => {
          const matchesQuery =
            `${task.title} ${task.documentName} ${task.requester}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())
          return (
            matchesQuery &&
            (stateFilter === 'all' || task.state.toLowerCase() === stateFilter)
          )
        })
        .sort(
          (first, second) =>
            new Date(first.dueAt).getTime() - new Date(second.dueAt).getTime(),
        ),
    [query, source, stateFilter],
  )
  const content = pageText[view]

  const updateTask = (task: DemoTask, state: TaskState) => {
    setTasks((current) =>
      current.map((entry) =>
        entry.id === task.id ? { ...entry, state } : entry,
      ),
    )
    setSelected(null)
    setFeedback(
      state === 'Completed'
        ? `${task.title} marked complete`
        : `Changes requested for ${task.title}`,
    )
    window.setTimeout(() => setFeedback(''), 3000)
  }

  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!comment.trim()) return
    setFeedback('Comment added to this local workflow preview')
    setComment('')
    window.setTimeout(() => setFeedback(''), 3000)
  }

  return (
    <div className="feature-page workflow-page">
      <PageHeader
        eyebrow={view === 'history' ? 'AUDITABLE WORKFLOWS' : 'WORK QUEUE'}
        title={content.title}
        description={content.description}
        action={
          view !== 'history' && (
            <button
              type="button"
              className="btn btn-outline-secondary page-action-button"
              onClick={() =>
                setFeedback(
                  'Workflow templates will be connected to the workflow service later',
                )
              }
            >
              <WorkflowIcon size={15} />
              Workflow templates
            </button>
          )
        }
      />
      <div className="workflow-summary-grid">
        <article>
          <span className="workflow-summary-icon icon-amber">
            <Clock3 size={17} />
          </span>
          <span>
            <small>Open</small>
            <strong>
              {tasks.filter((task) => task.state === 'Open').length}
            </strong>
          </span>
        </article>
        <article>
          <span className="workflow-summary-icon icon-blue">
            <FileCheck2 size={17} />
          </span>
          <span>
            <small>In review</small>
            <strong>
              {tasks.filter((task) => task.state === 'In review').length}
            </strong>
          </span>
        </article>
        <article>
          <span className="workflow-summary-icon icon-red">
            <History size={17} />
          </span>
          <span>
            <small>Overdue</small>
            <strong>
              {tasks.filter((task) => task.state === 'Overdue').length}
            </strong>
          </span>
        </article>
        <article>
          <span className="workflow-summary-icon icon-green">
            <CheckCheck size={17} />
          </span>
          <span>
            <small>Completed this month</small>
            <strong>
              {tasks.filter((task) => task.state === 'Completed').length + 18}
            </strong>
          </span>
        </article>
      </div>
      <section className="workflow-card">
        <div className="workflow-toolbar">
          <div className="workflow-filter-title">
            <h2>
              {view === 'approvals'
                ? 'Approval requests'
                : view === 'history'
                  ? 'Completed workflows'
                  : 'Assigned to me'}
            </h2>
            <span>{rows.length} records</span>
          </div>
          <div className="workflow-controls">
            <label className="workflow-search">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tasks"
              />
            </label>
            <label className="workflow-status-filter">
              <Filter size={14} />
              <select
                aria-label="Filter tasks by status"
                value={stateFilter}
                onChange={(event) => setStateFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="in review">In review</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="feature-empty">
            <Check size={24} />
            <h3>No tasks match</h3>
            <p>Clear your search or status filter to see more work.</p>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setQuery('')
                setStateFilter('all')
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table feature-table workflow-table mb-0">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Document</th>
                  <th>Requested by</th>
                  <th>Due date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((task) => (
                  <tr key={task.id} onClick={() => setSelected(task)}>
                    <td>
                      <div className="workflow-task-title">
                        <span
                          className={`workflow-task-icon task-${task.kind.toLowerCase()}`}
                        >
                          {task.kind === 'Approval' ? (
                            <ShieldCheck size={16} />
                          ) : task.kind === 'Review' ? (
                            <FileText size={16} />
                          ) : (
                            <Check size={16} />
                          )}
                        </span>
                        <span>
                          <strong>{task.title}</strong>
                          <small>{task.kind}</small>
                        </span>
                      </div>
                    </td>
                    <td>{task.documentName}</td>
                    <td>{task.requester}</td>
                    <td
                      className={task.state === 'Overdue' ? 'overdue-cell' : ''}
                    >
                      {formatDate(task.dueAt)}
                      <small className="table-subtext">
                        {formatRelative(task.dueAt)}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`priority-label priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={task.state} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Open ${task.title}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelected(task)
                        }}
                      >
                        <ArrowRight size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {feedback && (
        <div className="toast-message" role="status">
          <Check size={15} />
          {feedback}
        </div>
      )}
      <Modal
        open={Boolean(selected)}
        title={selected?.title ?? 'Task details'}
        description="Review the request and record a decision."
        onClose={() => setSelected(null)}
        size="wide"
      >
        {selected && (
          <div className="task-detail-layout">
            <div className="task-detail-main">
              <div className="task-detail-summary">
                <span
                  className={`workflow-task-icon task-${selected.kind.toLowerCase()}`}
                >
                  <FileText size={18} />
                </span>
                <div>
                  <StatusBadge status={selected.state} />
                  <h3>{selected.documentName}</h3>
                  <p>
                    {selected.kind} requested by {selected.requester}
                  </p>
                </div>
              </div>
              <div className="task-detail-fields">
                <div>
                  <span>Due date</span>
                  <strong>{formatDateTime(selected.dueAt)}</strong>
                </div>
                <div>
                  <span>Assigned to</span>
                  <strong>{selected.assignee}</strong>
                </div>
                <div>
                  <span>Priority</span>
                  <strong>{selected.priority}</strong>
                </div>
                <div>
                  <span>Workflow</span>
                  <strong>{selected.kind} review</strong>
                </div>
              </div>
              <div className="task-review-note">
                <h4>Request details</h4>
                <p>
                  Please review the latest version, confirm the document is
                  complete, and record your decision before the due date.
                </p>
              </div>
            </div>
            <aside className="task-comment-panel">
              <h3>
                <MessageSquareText size={15} /> Activity
              </h3>
              <div className="task-comment-entry">
                <span className="comment-avatar">
                  {selected.requester
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <p>
                  <strong>{selected.requester}</strong>
                  <small>{formatRelative(selected.dueAt)}</small>Submitted this
                  item for {selected.kind.toLowerCase()}.
                </p>
              </div>
              <form onSubmit={addComment}>
                <textarea
                  rows={3}
                  placeholder="Add a note to this workflow..."
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-outline-secondary btn-sm"
                >
                  Add note
                </button>
              </form>
            </aside>
            <div className="task-decision-actions">
              <span>Decision is stored in this browser session only.</span>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => updateTask(selected, 'Open')}
                >
                  <X size={14} />
                  Request changes
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => updateTask(selected, 'Completed')}
                >
                  <Check size={14} />
                  Approve and complete
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
