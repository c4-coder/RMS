export type RepositoryItem = {
  id: string
  name: string
  type: 'folder' | 'document'
  parentId: string | null
  modifiedAt: string
  modifiedBy: string
  size: number | null
  favorite: boolean
  shared: boolean
  recent: boolean
  trashed: boolean
  tags: string[]
}

export const demoRepository: RepositoryItem[] = [
  {
    id: 'projects', name: 'Projects', type: 'folder', parentId: null, modifiedAt: '2026-10-24T09:15:00Z', modifiedBy: 'Alex Morgan', size: null, favorite: true, shared: false, recent: true, trashed: false, tags: ['Team'],
  },
  {
    id: 'quarterly-review', name: 'Quarterly review', type: 'folder', parentId: null, modifiedAt: '2026-10-23T16:30:00Z', modifiedBy: 'Jamie Lee', size: null, favorite: false, shared: true, recent: true, trashed: false, tags: ['Q4'],
  },
  {
    id: 'legal', name: 'Legal', type: 'folder', parentId: null, modifiedAt: '2026-10-21T11:00:00Z', modifiedBy: 'Alex Morgan', size: null, favorite: false, shared: false, recent: false, trashed: false, tags: [],
  },
  {
    id: 'budget', name: 'Q4 budget.xlsx', type: 'document', parentId: null, modifiedAt: '2026-10-24T08:42:00Z', modifiedBy: 'Alex Morgan', size: 2488320, favorite: true, shared: false, recent: true, trashed: false, tags: ['Finance', 'Q4'],
  },
  {
    id: 'brand-guidelines', name: 'Brand guidelines.pdf', type: 'document', parentId: null, modifiedAt: '2026-10-23T14:18:00Z', modifiedBy: 'Jamie Lee', size: 4892672, favorite: false, shared: true, recent: true, trashed: false, tags: ['Brand'],
  },
  {
    id: 'meeting-notes', name: 'Board meeting notes.docx', type: 'document', parentId: null, modifiedAt: '2026-10-22T10:05:00Z', modifiedBy: 'Alex Morgan', size: 638976, favorite: false, shared: false, recent: true, trashed: false, tags: ['Confidential'],
  },
  {
    id: 'roadmap', name: 'Product roadmap.pptx', type: 'document', parentId: null, modifiedAt: '2026-10-20T12:44:00Z', modifiedBy: 'Priya Shah', size: 7340032, favorite: true, shared: true, recent: false, trashed: false, tags: ['Product', 'Planning'],
  },
  {
    id: 'campaign-art', name: 'Campaign artwork.png', type: 'document', parentId: null, modifiedAt: '2026-10-18T09:32:00Z', modifiedBy: 'Jamie Lee', size: 1638400, favorite: false, shared: false, recent: false, trashed: false, tags: ['Campaign'],
  },
  {
    id: 'onboarding', name: 'New hire onboarding.docx', type: 'document', parentId: 'projects', modifiedAt: '2026-10-22T15:20:00Z', modifiedBy: 'Alex Morgan', size: 921600, favorite: false, shared: true, recent: true, trashed: false, tags: ['People'],
  },
  {
    id: 'vendor-agreement', name: 'Vendor agreement.pdf', type: 'document', parentId: 'legal', modifiedAt: '2026-10-19T13:10:00Z', modifiedBy: 'Priya Shah', size: 1867776, favorite: false, shared: false, recent: false, trashed: false, tags: ['Legal', 'Review'],
  },
  {
    id: 'archive', name: 'Old launch brief.docx', type: 'document', parentId: null, modifiedAt: '2026-10-12T12:00:00Z', modifiedBy: 'Alex Morgan', size: 512000, favorite: false, shared: false, recent: false, trashed: true, tags: ['Archive'],
  },
]