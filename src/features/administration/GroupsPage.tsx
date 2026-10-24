import { useMemo, useState, type FormEvent } from 'react'
import {
  Check,
  ChevronDown,
  Plus,
  Search,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../../components/Modal'
import { PageHeader } from '../../components/PageHeader'
import { useDemoData } from '../demo/useDemoData'
import { formatDate } from '../demo/formatters'
import type { DemoGroup } from '../demo/types'

export function GroupsPage() {
  const { groups, setGroups, members } = useDemoData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [dialog, setDialog] = useState<'create' | 'members' | 'delete' | null>(
    null,
  )
  const [selectedGroup, setSelectedGroup] = useState<DemoGroup | null>(null)
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [toast, setToast] = useState('')
  const visibleGroups = useMemo(
    () =>
      groups.filter((group) =>
        `${group.name} ${group.description}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [groups, query],
  )

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const createGroup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!groupName.trim()) return
    const group: DemoGroup = {
      id: crypto.randomUUID(),
      name: groupName.trim(),
      description: description.trim(),
      memberIds: [],
      updatedAt: new Date().toISOString(),
    }
    setGroups((current) => [group, ...current])
    setGroupName('')
    setDescription('')
    setDialog(null)
    notify('Group created in this browser session')
  }

  const toggleMember = (memberId: string) => {
    if (!selectedGroup) return
    const updatedGroup = {
      ...selectedGroup,
      memberIds: selectedGroup.memberIds.includes(memberId)
        ? selectedGroup.memberIds.filter((id) => id !== memberId)
        : [...selectedGroup.memberIds, memberId],
      updatedAt: new Date().toISOString(),
    }
    setSelectedGroup(updatedGroup)
    setGroups((current) =>
      current.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group,
      ),
    )
  }

  const deleteGroup = () => {
    if (!selectedGroup) return
    setGroups((current) =>
      current.filter((group) => group.id !== selectedGroup.id),
    )
    setDialog(null)
    notify(`${selectedGroup.name} deleted from the local preview`)
    setSelectedGroup(null)
  }

  return (
    <div className="feature-page groups-page">
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Groups"
        description="Manage collections of members and their workspace responsibilities."
        action={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary page-action-button"
              onClick={() => navigate('/admin/users')}
            >
              View users
            </button>
            <button
              type="button"
              className="btn btn-primary page-action-button"
              onClick={() => setDialog('create')}
            >
              <Plus size={15} />
              Create group
            </button>
          </>
        }
      />
      <div className="groups-summary">
        <span>
          <UsersRound size={18} />
        </span>
        <div>
          <strong>{groups.length} groups</strong>
          <small>{members.length} workspace members available</small>
        </div>
        <label className="admin-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search groups"
          />
        </label>
      </div>
      <div className="groups-card-grid">
        {visibleGroups.map((group) => (
          <article className="group-card" key={group.id}>
            <div className="group-card-header">
              <span className="group-card-icon">
                <UsersRound size={19} />
              </span>
              <button
                type="button"
                className="subtle-icon-button"
                aria-label={`Manage ${group.name}`}
                onClick={() => {
                  setSelectedGroup(group)
                  setDialog('members')
                }}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <div className="group-member-stack">
              {group.memberIds.slice(0, 4).map((memberId) => {
                const member = members.find((item) => item.id === memberId)
                return (
                  <span title={member?.name} key={memberId}>
                    {member?.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('') ?? '?'}
                  </span>
                )
              })}
              {group.memberIds.length > 4 && (
                <span>+{group.memberIds.length - 4}</span>
              )}
              <small>{group.memberIds.length} members</small>
            </div>
            <div className="group-card-footer">
              <span>Updated {formatDate(group.updatedAt)}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedGroup(group)
                  setDialog('members')
                }}
              >
                Manage members
              </button>
            </div>
          </article>
        ))}
      </div>
      <Modal
        open={dialog === 'create'}
        title="Create a group"
        description="Create a group to organize membership and access assignments."
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
              form="create-group-form"
              className="btn btn-primary"
            >
              Create group
            </button>
          </>
        }
      >
        <form
          id="create-group-form"
          className="feature-form"
          onSubmit={createGroup}
        >
          <label>
            Group name
            <input
              autoFocus
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              required
              maxLength={90}
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this group responsible for?"
            />
          </label>
        </form>
      </Modal>
      <Modal
        open={dialog === 'members' && Boolean(selectedGroup)}
        title={selectedGroup?.name ?? 'Group members'}
        description="Select members who belong to this group."
        onClose={() => setDialog(null)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setDialog('delete')
              }}
            >
              Delete group
            </button>
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
        <div className="group-member-editor">
          {members.map((member) => {
            const isMember =
              selectedGroup?.memberIds.includes(member.id) ?? false
            return (
              <button
                type="button"
                className={`group-member-option${isMember ? ' selected' : ''}`}
                key={member.id}
                onClick={() => toggleMember(member.id)}
              >
                <span className="admin-avatar">
                  {member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <span>
                  <strong>{member.name}</strong>
                  <small>
                    {member.department} · {member.email}
                  </small>
                </span>
                <span className="group-member-check">
                  {isMember && <Check size={14} />}
                </span>
              </button>
            )
          })}
        </div>
      </Modal>
      <Modal
        open={dialog === 'delete'}
        title="Delete this group?"
        description="This removes the group from the local preview. It does not delete its members."
        onClose={() => setDialog(null)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setDialog('members')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteGroup}
            >
              Delete group
            </button>
          </>
        }
      >
        {selectedGroup && (
          <div className="delete-confirm-item">
            <ShieldCheck size={17} />
            <strong>{selectedGroup.name}</strong>
          </div>
        )}
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
