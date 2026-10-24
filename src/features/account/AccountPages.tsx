import { useMemo, useState, type FormEvent } from 'react'
import {
  Bell,
  Check,
  CheckCheck,
  CircleUserRound,
  KeyRound,
  Mail,
  MessageCircle,
  Save,
  Settings2,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { useDemoData } from '../demo/useDemoData'
import { formatDateTime, formatRelative } from '../demo/formatters'

export function NotificationsPage() {
  const { notifications, setNotifications } = useDemoData()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const visible = useMemo(
    () =>
      notifications.filter(
        (notification) => filter === 'all' || notification.unread,
      ),
    [filter, notifications],
  )
  const iconFor = (kind: string) =>
    kind === 'share' ? (
      <Share2 size={16} />
    ) : kind === 'approval' ? (
      <Check size={16} />
    ) : kind === 'comment' ? (
      <MessageCircle size={16} />
    ) : (
      <Bell size={16} />
    )

  return (
    <div className="feature-page account-page">
      <PageHeader
        eyebrow="WORKSPACE INBOX"
        title="Notifications"
        description="Keep up with the content and decisions that need your attention."
        action={
          <button
            type="button"
            className="btn btn-outline-secondary page-action-button"
            onClick={() =>
              setNotifications((current) =>
                current.map((notification) => ({
                  ...notification,
                  unread: false,
                })),
              )
            }
          >
            <CheckCheck size={15} />
            Mark all as read
          </button>
        }
      />
      <div className="account-tab-row">
        <button
          type="button"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All activity <span>{notifications.length}</span>
        </button>
        <button
          type="button"
          className={filter === 'unread' ? 'active' : ''}
          onClick={() => setFilter('unread')}
        >
          Unread{' '}
          <span>
            {notifications.filter((notification) => notification.unread).length}
          </span>
        </button>
      </div>
      <section className="notification-list-card">
        {visible.length === 0 ? (
          <div className="feature-empty">
            <CheckCheck size={24} />
            <h3>You’re all caught up</h3>
            <p>New shares, comments, and approval requests will appear here.</p>
          </div>
        ) : (
          visible.map((notification) => (
            <article
              className={`full-notification${notification.unread ? ' unread' : ''}`}
              key={notification.id}
            >
              <span
                className={`full-notification-icon notice-${notification.kind}`}
              >
                {iconFor(notification.kind)}
              </span>
              <div className="full-notification-copy">
                <strong>{notification.title}</strong>
                <p>{notification.description}</p>
                <small>
                  {formatRelative(notification.createdAt)} ·{' '}
                  {formatDateTime(notification.createdAt)}
                </small>
              </div>
              {notification.unread && (
                <span className="unread-dot" aria-label="Unread" />
              )}
              <button
                type="button"
                className="text-action"
                onClick={() =>
                  setNotifications((current) =>
                    current.map((item) =>
                      item.id === notification.id
                        ? { ...item, unread: !item.unread }
                        : item,
                    ),
                  )
                }
              >
                {notification.unread ? 'Mark read' : 'Mark unread'}
              </button>
            </article>
          ))
        )}
      </section>
    </div>
  )
}

export function ProfilePage() {
  const { activity, members } = useDemoData()
  const [name, setName] = useState('Alex Morgan')
  const [department, setDepartment] = useState('Operations')
  const [saved, setSaved] = useState(false)
  const member = members.find((item) => item.email.startsWith('alex@'))
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2600)
  }

  return (
    <div className="feature-page account-page">
      <PageHeader
        eyebrow="ACCOUNT"
        title="Your profile"
        description="Manage your workspace identity and review your recent activity."
        action={
          <Link
            to="/preferences"
            className="btn btn-outline-secondary page-action-button"
          >
            <Settings2 size={15} />
            Preferences
          </Link>
        }
      />
      <div className="profile-layout">
        <section className="profile-main-card">
          <div className="profile-banner">
            <span className="profile-large-avatar">AM</span>
            <div>
              <h2>{name}</h2>
              <p>Workspace administrator · Northstar Studio</p>
            </div>
            <span className="profile-active-state">
              <span />
              Active
            </span>
          </div>
          <form className="profile-edit-form" onSubmit={submit}>
            <div className="profile-form-heading">
              <h3>Personal information</h3>
              <p>Details visible to members of your workspace.</p>
            </div>
            <div className="profile-fields">
              <label>
                Full name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label>
                Work email
                <input
                  value={member?.email ?? 'alex@northstar.example'}
                  readOnly
                />
              </label>
              <label>
                Department
                <input
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                />
              </label>
              <label>
                Role
                <input value="Workspace administrator" readOnly />
              </label>
            </div>
            <div className="profile-form-footer">
              <span className="profile-form-hint">
                <ShieldCheck size={14} /> Profile changes are local to this
                demo.
              </span>
              <button className="btn btn-primary" type="submit">
                <Save size={15} />
                {saved ? 'Saved' : 'Save profile'}
              </button>
            </div>
          </form>
        </section>
        <aside className="profile-side-card">
          <h3>Account security</h3>
          <div className="account-security-row">
            <span>
              <Mail size={16} />
            </span>
            <div>
              <strong>Email address</strong>
              <small>Verified · {member?.email}</small>
            </div>
            <ShieldCheck size={15} />
          </div>
          <div className="account-security-row">
            <span>
              <KeyRound size={16} />
            </span>
            <div>
              <strong>Password</strong>
              <small>Last changed 46 days ago</small>
            </div>
            <button type="button" onClick={() => setSaved(true)}>
              Update
            </button>
          </div>
          <div className="security-tip">
            <ShieldCheck size={16} />
            <p>
              <strong>Good security posture</strong>
              <small>
                Demo account has no external session or persistent credential
                storage.
              </small>
            </p>
          </div>
        </aside>
        <section className="profile-activity-card">
          <div className="profile-form-heading">
            <h3>Recent activity</h3>
            <p>Actions performed in your workspace.</p>
          </div>
          {activity.slice(0, 5).map((entry) => (
            <div className="profile-activity-row" key={entry.id}>
              <span className="activity-small-avatar">
                <CircleUserRound size={16} />
              </span>
              <span>
                <strong>
                  {entry.actor} {entry.action} {entry.target}
                </strong>
                <small>{formatRelative(entry.createdAt)}</small>
              </span>
            </div>
          ))}
        </section>
        <aside className="profile-side-card profile-preferences-shortcut">
          <h3>Workspace preferences</h3>
          <p>Choose how Alfresco fits your daily work.</p>
          <Link to="/preferences">
            <SlidersHorizontal size={15} />
            Notification and display settings
          </Link>
          <Link to="/preferences">
            <UserRound size={15} />
            Profile visibility
          </Link>
        </aside>
      </div>
    </div>
  )
}

export function PreferencesPage() {
  const [emailNotices, setEmailNotices] = useState(true)
  const [taskReminders, setTaskReminders] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [compactRows, setCompactRows] = useState(false)
  const [presenceVisible, setPresenceVisible] = useState(true)
  const [saved, setSaved] = useState(false)

  return (
    <div className="feature-page account-page">
      <PageHeader
        eyebrow="ACCOUNT"
        title="Preferences"
        description="Tune notifications, appearance, and content defaults for your account."
        action={
          <button
            type="button"
            className="btn btn-primary page-action-button"
            onClick={() => {
              setSaved(true)
              window.setTimeout(() => setSaved(false), 2500)
            }}
          >
            <Check size={15} />
            {saved ? 'Preferences saved' : 'Save preferences'}
          </button>
        }
      />
      <div className="preferences-layout">
        <section className="preferences-card">
          <div className="preferences-card-heading">
            <span className="preferences-icon blue">
              <Bell size={17} />
            </span>
            <div>
              <h2>Notifications</h2>
              <p>Choose which updates reach your inbox.</p>
            </div>
          </div>
          <PreferenceToggle
            title="Email notifications"
            description="Receive important shares and mentions by email."
            checked={emailNotices}
            onChange={setEmailNotices}
          />
          <PreferenceToggle
            title="Task reminders"
            description="Get a reminder before an assigned task is due."
            checked={taskReminders}
            onChange={setTaskReminders}
          />
          <PreferenceToggle
            title="Weekly digest"
            description="A Monday summary of workspace activity."
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
        </section>
        <section className="preferences-card">
          <div className="preferences-card-heading">
            <span className="preferences-icon teal">
              <SlidersHorizontal size={17} />
            </span>
            <div>
              <h2>Display and content</h2>
              <p>Set up your default document workspace.</p>
            </div>
          </div>
          <PreferenceToggle
            title="Compact document rows"
            description="Show more files in the repository list."
            checked={compactRows}
            onChange={setCompactRows}
          />
          <label className="preference-select">
            Default repository view
            <select defaultValue="List">
              <option>List</option>
              <option>Grid</option>
            </select>
          </label>
          <label className="preference-select">
            Time zone
            <select defaultValue="America/New_York">
              <option value="America/New_York">Eastern Time (UTC−04:00)</option>
              <option value="America/Chicago">Central Time (UTC−05:00)</option>
              <option value="Europe/London">London (UTC+01:00)</option>
              <option value="UTC">UTC</option>
            </select>
          </label>
        </section>
        <section className="preferences-card privacy-preferences">
          <div className="preferences-card-heading">
            <span className="preferences-icon violet">
              <ShieldCheck size={17} />
            </span>
            <div>
              <h2>Privacy</h2>
              <p>Control how others see your activity.</p>
            </div>
          </div>
          <PreferenceToggle
            title="Show my presence"
            description="Let workspace members see when you are active."
            checked={presenceVisible}
            onChange={setPresenceVisible}
          />
          <p className="preference-footnote">
            Preference changes are held locally for this frontend preview.
          </p>
        </section>
      </div>
    </div>
  )
}

function PreferenceToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="preference-toggle">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle-track" />
    </label>
  )
}
