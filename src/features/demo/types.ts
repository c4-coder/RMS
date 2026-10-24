export type RepositoryRecord = {
  id: string
  name: string
  kind: 'folder' | 'document'
  folderId: string | null
  owner: string
  updatedAt: string
  size: number | null
  starred: boolean
  shared: boolean
  trashed: boolean
  tags: string[]
  version: number
  description: string
}

export type TaskState = 'Open' | 'In review' | 'Completed' | 'Overdue'

export type DemoTask = {
  id: string
  title: string
  documentName: string
  assignee: string
  requester: string
  dueAt: string
  state: TaskState
  priority: 'Low' | 'Normal' | 'High'
  kind: 'Approval' | 'Review' | 'Signature' | 'Metadata'
}

export type DemoNotification = {
  id: string
  title: string
  description: string
  createdAt: string
  unread: boolean
  kind: 'share' | 'approval' | 'comment' | 'system'
}

export type DemoActivity = {
  id: string
  actor: string
  action: string
  target: string
  createdAt: string
  kind: 'upload' | 'edit' | 'share' | 'approval' | 'comment' | 'delete'
}

export type DemoWorkspace = {
  id: string
  name: string
  description: string
  libraryCount: number
  memberCount: number
  documentCount: number
  color: string
  role: string
}

export type DemoMember = {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'Active' | 'Invited' | 'Suspended'
  lastActive: string
}