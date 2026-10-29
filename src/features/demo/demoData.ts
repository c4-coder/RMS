import type { DemoActivity, DemoGroup, DemoLibrary, DemoMember, DemoNotification, DemoTask, DemoWorkspace, RepositoryRecord } from './types'

const now = new Date('2026-10-24T12:00:00')
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString()
const daysFromNow = (days: number) => new Date(now.getTime() + days * 86400000).toISOString()

export const demoCredentials = {
  email: 'admin@alfresco.com',
  password: 'Admin@123',
}

export const demoItems: RepositoryRecord[] = [
  { id: 'folder-projects', name: 'Projects', kind: 'folder', folderId: null, owner: 'Alex Morgan', updatedAt: daysAgo(0), size: null, starred: true, shared: false, trashed: false, tags: ['Team'], version: 1, description: 'Active project documents and working files.' },
  { id: 'folder-quarterly', name: 'Quarterly review', kind: 'folder', folderId: null, owner: 'Jamie Lee', updatedAt: daysAgo(1), size: null, starred: false, shared: true, trashed: false, tags: ['Q4'], version: 1, description: 'Materials for the quarterly business review.' },
  { id: 'folder-legal', name: 'Legal', kind: 'folder', folderId: null, owner: 'Alex Morgan', updatedAt: daysAgo(3), size: null, starred: false, shared: false, trashed: false, tags: ['Legal'], version: 1, description: 'Agreements and approved legal records.' },
  { id: 'folder-people', name: 'People operations', kind: 'folder', folderId: null, owner: 'Priya Shah', updatedAt: daysAgo(4), size: null, starred: false, shared: true, trashed: false, tags: ['People'], version: 1, description: 'Hiring, onboarding, and policy documents.' },
  { id: 'doc-budget', name: 'Q4 budget.xlsx', kind: 'document', folderId: null, owner: 'Alex Morgan', updatedAt: daysAgo(0), size: 2488320, starred: true, shared: false, trashed: false, tags: ['Finance', 'Q4'], version: 6, description: 'Department forecasts and approved quarterly spend.' },
  { id: 'doc-brand', name: 'Brand guidelines.pdf', kind: 'document', folderId: null, owner: 'Jamie Lee', updatedAt: daysAgo(1), size: 4892672, starred: false, shared: true, trashed: false, tags: ['Brand', 'Approved'], version: 3, description: 'Current identity, editorial, and asset usage standards.' },
  { id: 'doc-board', name: 'Board meeting notes.docx', kind: 'document', folderId: null, owner: 'Alex Morgan', updatedAt: daysAgo(2), size: 638976, starred: false, shared: false, trashed: false, tags: ['Confidential'], version: 2, description: 'Notes and decisions from the October board meeting.' },
  { id: 'doc-roadmap', name: 'Product roadmap.pptx', kind: 'document', folderId: null, owner: 'Priya Shah', updatedAt: daysAgo(4), size: 7340032, starred: true, shared: true, trashed: false, tags: ['Product', 'Planning'], version: 9, description: 'Product milestones and launch dependencies for 2027.' },
  { id: 'doc-campaign', name: 'Campaign artwork.png', kind: 'document', folderId: null, owner: 'Jamie Lee', updatedAt: daysAgo(6), size: 1638400, starred: false, shared: false, trashed: false, tags: ['Campaign'], version: 1, description: 'Approved artwork for the autumn customer campaign.' },
  { id: 'doc-contract', name: 'Vendor agreement.pdf', kind: 'document', folderId: 'folder-legal', owner: 'Priya Shah', updatedAt: daysAgo(5), size: 1867776, starred: false, shared: true, trashed: false, tags: ['Legal', 'Review'], version: 4, description: 'Renewal agreement awaiting legal approval.' },
  { id: 'doc-onboarding', name: 'New hire onboarding.docx', kind: 'document', folderId: 'folder-people', owner: 'Alex Morgan', updatedAt: daysAgo(2), size: 921600, starred: false, shared: true, trashed: false, tags: ['People', 'Template'], version: 5, description: 'New employee onboarding checklist and resources.' },
  { id: 'doc-brief', name: 'Launch brief.docx', kind: 'document', folderId: 'folder-projects', owner: 'Alex Morgan', updatedAt: daysAgo(1), size: 841000, starred: true, shared: true, trashed: false, tags: ['Launch', 'In review'], version: 3, description: 'Go-to-market brief for the winter release.' },
  { id: 'doc-research', name: 'Customer research.pdf', kind: 'document', folderId: 'folder-projects', owner: 'Jamie Lee', updatedAt: daysAgo(3), size: 3210000, starred: false, shared: true, trashed: false, tags: ['Research'], version: 2, description: 'Interview insights and product feedback synthesis.' },
  { id: 'doc-invoice', name: 'October invoice.pdf', kind: 'document', folderId: null, owner: 'Alex Morgan', updatedAt: daysAgo(8), size: 412000, starred: false, shared: false, trashed: true, tags: ['Finance'], version: 1, description: 'Archived vendor invoice.' },
]

export const demoTasks: DemoTask[] = [
  { id: 'task-contract', title: 'Approve vendor agreement', documentName: 'Vendor agreement.pdf', assignee: 'Alex Morgan', requester: 'Priya Shah', dueAt: daysFromNow(0), state: 'In review', priority: 'High', kind: 'Approval' },
  { id: 'task-brief', title: 'Review launch brief', documentName: 'Launch brief.docx', assignee: 'Alex Morgan', requester: 'Jamie Lee', dueAt: daysFromNow(1), state: 'Open', priority: 'High', kind: 'Review' },
  { id: 'task-budget', title: 'Confirm Q4 cost center', documentName: 'Q4 budget.xlsx', assignee: 'Alex Morgan', requester: 'Morgan Chen', dueAt: daysFromNow(2), state: 'Open', priority: 'Normal', kind: 'Metadata' },
  { id: 'task-brand', title: 'Sign updated brand policy', documentName: 'Brand guidelines.pdf', assignee: 'Alex Morgan', requester: 'Jamie Lee', dueAt: daysFromNow(3), state: 'Open', priority: 'Normal', kind: 'Signature' },
  { id: 'task-retention', title: 'Review retention classification', documentName: 'Board meeting notes.docx', assignee: 'Alex Morgan', requester: 'Records team', dueAt: daysAgo(1), state: 'Overdue', priority: 'High', kind: 'Review' },
  { id: 'task-policy', title: 'Verify onboarding metadata', documentName: 'New hire onboarding.docx', assignee: 'Alex Morgan', requester: 'Priya Shah', dueAt: daysAgo(2), state: 'Completed', priority: 'Low', kind: 'Metadata' },
]

export const demoNotifications: DemoNotification[] = [
  { id: 'notice-share', title: 'Jamie Lee shared a document', description: 'Quarterly review materials are ready for you.', createdAt: daysAgo(0), unread: true, kind: 'share' },
  { id: 'notice-approval', title: 'Approval requested', description: 'Vendor agreement.pdf needs your review.', createdAt: daysAgo(0), unread: true, kind: 'approval' },
  { id: 'notice-comment', title: 'You were mentioned', description: 'Priya Shah mentioned you on Launch brief.docx.', createdAt: daysAgo(1), unread: false, kind: 'comment' },
  { id: 'notice-system', title: 'Weekly activity summary', description: 'Your workspace had 28 document updates this week.', createdAt: daysAgo(3), unread: false, kind: 'system' },
]

export const demoActivity: DemoActivity[] = [
  { id: 'activity-1', actor: 'Alex Morgan', action: 'updated', target: 'Q4 budget.xlsx', createdAt: daysAgo(0), kind: 'edit' },
  { id: 'activity-2', actor: 'Jamie Lee', action: 'shared', target: 'Quarterly review', createdAt: daysAgo(0), kind: 'share' },
  { id: 'activity-3', actor: 'Priya Shah', action: 'requested approval for', target: 'Vendor agreement.pdf', createdAt: daysAgo(1), kind: 'approval' },
  { id: 'activity-4', actor: 'Morgan Chen', action: 'uploaded', target: 'Customer research.pdf', createdAt: daysAgo(2), kind: 'upload' },
  { id: 'activity-5', actor: 'Jamie Lee', action: 'commented on', target: 'Launch brief.docx', createdAt: daysAgo(2), kind: 'comment' },
  { id: 'activity-6', actor: 'Alex Morgan', action: 'restored', target: 'Brand guidelines.pdf', createdAt: daysAgo(4), kind: 'edit' },
]

export const demoWorkspaces: DemoWorkspace[] = [
  { id: 'space-brand', name: 'Brand & Communications', description: 'Shared identity standards and campaign assets.', libraryCount: 3, memberCount: 12, documentCount: 248, color: 'teal', role: 'Editor' },
  { id: 'space-product', name: 'Product Office', description: 'Roadmaps, discovery research, and release plans.', libraryCount: 4, memberCount: 18, documentCount: 532, color: 'blue', role: 'Member' },
  { id: 'space-people', name: 'People Operations', description: 'Policies, onboarding, and employee resources.', libraryCount: 2, memberCount: 9, documentCount: 184, color: 'amber', role: 'Member' },
  { id: 'space-legal', name: 'Legal & Compliance', description: 'Agreements, retention, and compliance records.', libraryCount: 3, memberCount: 7, documentCount: 316, color: 'violet', role: 'Viewer' },
]

export const demoLibraries: DemoLibrary[] = [
  { id: 'library-brand', name: 'Brand assets', workspaceId: 'space-brand', description: 'Approved identity files, templates, and campaigns.', documentCount: 92, classification: 'Internal', retention: '7 years' },
  { id: 'library-campaigns', name: 'Campaigns', workspaceId: 'space-brand', description: 'Active and archived communications campaigns.', documentCount: 156, classification: 'Internal', retention: '5 years' },
  { id: 'library-roadmap', name: 'Product roadmap', workspaceId: 'space-product', description: 'Product plans, research, and release materials.', documentCount: 218, classification: 'Confidential', retention: '7 years' },
  { id: 'library-legal', name: 'Agreements', workspaceId: 'space-legal', description: 'Executed agreements and documents under review.', documentCount: 316, classification: 'Restricted', retention: 'Permanent' },
  { id: 'library-people', name: 'People policies', workspaceId: 'space-people', description: 'Current employee policies and templates.', documentCount: 184, classification: 'Confidential', retention: '7 years' },
]

export const demoMembers: DemoMember[] = [
  { id: 'member-alex', name: 'Alex Morgan', email: 'alex@northstar.example', role: 'Workspace admin', department: 'Operations', status: 'Active', lastActive: 'Now' },
  { id: 'member-jamie', name: 'Jamie Lee', email: 'jamie@northstar.example', role: 'Content editor', department: 'Brand', status: 'Active', lastActive: '12 min ago' },
  { id: 'member-priya', name: 'Priya Shah', email: 'priya@northstar.example', role: 'Approver', department: 'Legal', status: 'Active', lastActive: '1 hour ago' },
  { id: 'member-morgan', name: 'Morgan Chen', email: 'morgan@northstar.example', role: 'Member', department: 'Product', status: 'Active', lastActive: 'Yesterday' },
  { id: 'member-sam', name: 'Sam Rivera', email: 'sam@northstar.example', role: 'Records manager', department: 'Operations', status: 'Invited', lastActive: 'Invitation pending' },
]

export const demoGroups: DemoGroup[] = [
  { id: 'group-authors', name: 'Content authors', description: 'Members who create and maintain workspace content.', memberIds: ['member-alex', 'member-jamie', 'member-morgan'], updatedAt: daysAgo(2) },
  { id: 'group-approvers', name: 'Legal approvers', description: 'Authorized reviewers for legal and policy workflows.', memberIds: ['member-priya', 'member-alex'], updatedAt: daysAgo(4) },
  { id: 'group-records', name: 'Records officers', description: 'Records retention and disposition reviewers.', memberIds: ['member-sam', 'member-alex'], updatedAt: daysAgo(7) },
  { id: 'group-admins', name: 'Workspace administrators', description: 'People responsible for workspace configuration.', memberIds: ['member-alex'], updatedAt: daysAgo(8) },
]