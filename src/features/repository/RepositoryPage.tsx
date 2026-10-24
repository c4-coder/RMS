import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  ArchiveRestore,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileImage,
  FileSpreadsheet,
  FileText,
  Filter,
  Folder,
  FolderPlus,
  History,
  LayoutGrid,
  List,
  MessageCircle,
  MoreHorizontal,
  MoveRight,
  PanelRight,
  Pencil,
  Search,
  Share2,
  Star,
  Tag,
  Trash2,
  Upload,
  UsersRound,
} from 'lucide-react'
import { Modal } from '../../components/Modal'
import { PageHeader, StatusBadge } from '../../components/PageHeader'
import { useDemoData } from '../demo/useDemoData'
import { formatBytes, formatDate, formatDateTime } from '../demo/formatters'
import type { RepositoryRecord } from '../demo/types'

export type RepositoryView =
  | 'my-files'
  | 'recent'
  | 'favorites'
  | 'shared'
  | 'trash'
  | 'search'

const viewContent: Record<
  RepositoryView,
  { title: string; description: string }
> = {
  'my-files': {
    title: 'My Files',
    description: 'Your personal repository, organized and ready to work.',
  },
  recent: {
    title: 'Recent',
    description: 'Documents and folders you have worked with lately.',
  },
  favorites: {
    title: 'Favorites',
    description: 'Your quick-access collection of important content.',
  },
  shared: {
    title: 'Shared with me',
    description: 'Content colleagues have shared with your account.',
  },
  trash: {
    title: 'Trash',
    description: 'Restore recently deleted documents and folders.',
  },
  search: {
    title: 'Search',
    description: 'Search document names, descriptions, tags, and owners.',
  },
}

type DialogKind =
  | 'create-folder'
  | 'rename'
  | 'share'
  | 'preview'
  | 'versions'
  | 'metadata'
  | 'delete'
  | 'restore'
  | 'comments'
  | 'upload'
  | 'move'
  | 'copy'
  | 'download'
  | null

type CommentRecord = {
  id: string
  author: string
  text: string
  createdAt: string
}

export function RepositoryPage({ view }: { view: RepositoryView }) {
  const { items, setItems } = useDemoData()
  const location = useLocation()
  const [query, setQuery] = useState(
    (location.state as { query?: string } | null)?.query ?? '',
  )
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortKey, setSortKey] = useState<'updatedAt' | 'name'>('updatedAt')
  const [gridView, setGridView] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(true)
  const [folderId, setFolderId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [dialogItemId, setDialogItemId] = useState<string | null>(null)
  const [targetFolderId, setTargetFolderId] = useState('root')
  const [nameValue, setNameValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [tagsValue, setTagsValue] = useState('')
  const [shareEmail, setShareEmail] = useState('')
  const [sharePermission, setSharePermission] = useState('Can view')
  const [comments, setComments] = useState<Record<string, CommentRecord[]>>({})
  const [commentValue, setCommentValue] = useState('')
  const [toast, setToast] = useState('')
  const uploadRef = useRef<HTMLInputElement>(null)
  const activeItem = items.find(
    (item) => item.id === (dialogItemId ?? selectedId),
  )
  const currentFolder = items.find(
    (item) => item.id === folderId && item.kind === 'folder',
  )
  const folderTrail = useMemo(() => {
    const trail: RepositoryRecord[] = []
    let cursor = currentFolder
    while (cursor) {
      trail.unshift(cursor)
      cursor = items.find(
        (item) => item.id === cursor?.folderId && item.kind === 'folder',
      )
    }
    return trail
  }, [currentFolder, items])
  const normalizedQuery = query.trim().toLowerCase()
  const visibleItems = useMemo(
    () =>
      items
        .filter((item) => {
          if (view === 'trash' ? !item.trashed : item.trashed) return false
          if (view === 'my-files' && item.folderId !== folderId) return false
          if (
            view === 'recent' &&
            ![
              'doc-budget',
              'doc-brand',
              'doc-board',
              'doc-contract',
              'doc-brief',
              'doc-research',
            ].includes(item.id)
          )
            return false
          if (view === 'favorites' && !item.starred) return false
          if (view === 'shared' && !item.shared) return false
          if (view === 'search' && !normalizedQuery) return false
          if (
            view === 'search' &&
            !`${item.name} ${item.description} ${item.tags.join(' ')} ${item.owner}`
              .toLowerCase()
              .includes(normalizedQuery)
          )
            return false
          if (typeFilter !== 'all' && item.kind !== typeFilter) return false
          return true
        })
        .sort((first, second) => {
          if (first.kind !== second.kind && view === 'my-files')
            return first.kind === 'folder' ? -1 : 1
          return sortKey === 'name'
            ? first.name.localeCompare(second.name)
            : second.updatedAt.localeCompare(first.updatedAt)
        }),
    [folderId, items, normalizedQuery, sortKey, typeFilter, view],
  )

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  const openDialog = (
    kind: Exclude<DialogKind, null>,
    item?: RepositoryRecord,
  ) => {
    setDialog(kind)
    setDialogItemId(item?.id ?? selectedId)
    setNameValue(kind === 'rename' && item ? item.name : '')
    setDescriptionValue(item?.description ?? '')
    setTagsValue(item?.tags.join(', ') ?? '')
    setShareEmail('')
    setCommentValue('')
    setTargetFolderId(item?.folderId ?? 'root')
    setOpenMenuId(null)
  }

  const closeDialog = () => {
    setDialog(null)
    setDialogItemId(null)
  }

  const createFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = nameValue.trim()
    if (!name) return
    setItems((current) => [
      {
        id: crypto.randomUUID(),
        name,
        kind: 'folder',
        folderId,
        owner: 'Alex Morgan',
        updatedAt: new Date().toISOString(),
        size: null,
        starred: false,
        shared: false,
        trashed: false,
        tags: [],
        version: 1,
        description: 'New folder',
      },
      ...current,
    ])
    notify(`Created ${name}`)
    closeDialog()
  }

  const renameItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = nameValue.trim()
    if (!activeItem || !name) return
    setItems((current) =>
      current.map((item) =>
        item.id === activeItem.id
          ? { ...item, name, updatedAt: new Date().toISOString() }
          : item,
      ),
    )
    notify('Name updated')
    closeDialog()
  }

  const saveMetadata = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeItem) return
    setItems((current) =>
      current.map((item) =>
        item.id === activeItem.id
          ? {
              ...item,
              description: descriptionValue.trim(),
              tags: tagsValue
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
    notify('Metadata saved in this browser session')
    closeDialog()
  }

  const shareItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeItem || !shareEmail.trim()) return
    setItems((current) =>
      current.map((item) =>
        item.id === activeItem.id ? { ...item, shared: true } : item,
      ),
    )
    notify(
      `Shared with ${shareEmail.trim()} (${sharePermission.toLowerCase()}) in the demo`,
    )
    closeDialog()
  }

  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeItem || !commentValue.trim()) return
    const record: CommentRecord = {
      id: crypto.randomUUID(),
      author: 'Alex Morgan',
      text: commentValue.trim(),
      createdAt: new Date().toISOString(),
    }
    setComments((current) => ({
      ...current,
      [activeItem.id]: [...(current[activeItem.id] ?? []), record],
    }))
    setCommentValue('')
  }

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    const files = selectedFiles.filter((file) => file.size <= 50 * 1024 * 1024)
    if (!files.length && selectedFiles.length)
      notify('Files must be smaller than 50 MB in the frontend preview')
    const added: RepositoryRecord[] = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      kind: 'document',
      folderId,
      owner: 'Alex Morgan',
      updatedAt: new Date().toISOString(),
      size: file.size,
      starred: false,
      shared: false,
      trashed: false,
      tags: ['New upload'],
      version: 1,
      description:
        'Added in the local frontend preview. File contents are not stored.',
    }))
    if (added.length) {
      setItems((current) => [...added, ...current])
      notify(
        `${added.length} file${added.length === 1 ? '' : 's'} listed in the demo repository`,
      )
      closeDialog()
    }
    event.target.value = ''
  }

  const toggleStar = (id: string) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, starred: !item.starred } : item,
      ),
    )
  const confirmTrash = () => {
    const ids = dialogItemId ? [dialogItemId] : selectedIds
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, trashed: true } : item,
      ),
    )
    setSelectedIds([])
    notify(`${ids.length} item${ids.length === 1 ? '' : 's'} moved to trash`)
    closeDialog()
  }
  const confirmRestore = () => {
    if (!activeItem) return
    setItems((current) =>
      current.map((entry) =>
        entry.id === activeItem.id ? { ...entry, trashed: false } : entry,
      ),
    )
    notify(`${activeItem.name} restored`)
    closeDialog()
  }
  const restore = (item: RepositoryRecord) => openDialog('restore', item)
  const moveItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeItem) return
    const destination = targetFolderId === 'root' ? null : targetFolderId
    if (destination === activeItem.id) {
      notify('A folder cannot be moved into itself')
      return
    }
    setItems((current) =>
      current.map((item) =>
        item.id === activeItem.id
          ? {
              ...item,
              folderId: destination,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
    notify(`${activeItem.name} moved`)
    closeDialog()
  }
  const copyItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeItem) return
    const copy: RepositoryRecord = {
      ...activeItem,
      id: crypto.randomUUID(),
      name: `${activeItem.name.replace(/( \(copy \d+\))?$/, '')} (copy)`,
      folderId: targetFolderId === 'root' ? null : targetFolderId,
      owner: 'Alex Morgan',
      updatedAt: new Date().toISOString(),
      starred: false,
      trashed: false,
      tags: [...activeItem.tags],
    }
    setItems((current) => [copy, ...current])
    notify(`${copy.name} created`)
    closeDialog()
  }

  const content = viewContent[view]
  const totalBytes = visibleItems.reduce(
    (sum, item) => sum + (item.size ?? 0),
    0,
  )
  const modalFooter = (submitLabel: string, onCancel = closeDialog) => (
    <>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="repository-dialog-form"
        className="btn btn-primary"
      >
        {submitLabel}
      </button>
    </>
  )

  return (
    <div className="feature-page repository-page">
      <PageHeader
        eyebrow={view === 'my-files' ? 'PERSONAL REPOSITORY' : 'CONTENT'}
        title={currentFolder?.name ?? content.title}
        description={content.description}
        action={
          view === 'my-files' && (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary page-action-button"
                onClick={() => openDialog('create-folder')}
              >
                <FolderPlus size={15} />
                New folder
              </button>
              <button
                type="button"
                className="btn btn-primary page-action-button"
                onClick={() => openDialog('upload')}
              >
                <Upload size={15} />
                Upload
              </button>
            </>
          )
        }
      />
      {view === 'my-files' && (
        <div className="repository-breadcrumbs">
          <button type="button" onClick={() => setFolderId(null)}>
            My Files
          </button>
          {folderTrail.map((folder) => (
            <span key={folder.id}>
              <ChevronRight size={13} />
              <button type="button" onClick={() => setFolderId(folder.id)}>
                {folder.name}
              </button>
            </span>
          ))}
        </div>
      )}

      {view === 'my-files' && (
        <div className="repository-summary-row">
          <div>
            <span className="repository-summary-icon blue">
              <FileText size={17} />
            </span>
            <span>
              <strong>
                {
                  items.filter(
                    (item) => item.kind === 'document' && !item.trashed,
                  ).length
                }
              </strong>
              <small>Documents</small>
            </span>
          </div>
          <div>
            <span className="repository-summary-icon teal">
              <Folder size={17} />
            </span>
            <span>
              <strong>
                {
                  items.filter(
                    (item) => item.kind === 'folder' && !item.trashed,
                  ).length
                }
              </strong>
              <small>Folders</small>
            </span>
          </div>
          <div>
            <span className="repository-summary-icon violet">
              <UsersRound size={17} />
            </span>
            <span>
              <strong>
                {items.filter((item) => item.shared && !item.trashed).length}
              </strong>
              <small>Shared</small>
            </span>
          </div>
          <span className="repository-total-size">
            {formatBytes(totalBytes)} shown
          </span>
        </div>
      )}

      <section className="repository-card">
        <div className="repository-toolbar">
          <div className="repository-toolbar-left">
            {selectedIds.length ? (
              <>
                <strong>{selectedIds.length} selected</strong>
                <button
                  type="button"
                  onClick={() => {
                    selectedIds.forEach(toggleStar)
                    setSelectedIds([])
                    notify('Favorites updated')
                  }}
                >
                  <Star size={14} />
                  Favorite
                </button>
                <button
                  type="button"
                  className="delete-text"
                  onClick={() => openDialog('delete')}
                >
                  <Trash2 size={14} />
                  Move to trash
                </button>
              </>
            ) : (
              <span>
                {visibleItems.length} items{view === 'trash' ? ' in trash' : ''}
              </span>
            )}
          </div>
          <div className="repository-toolbar-right">
            {view === 'search' && (
              <label className="repository-search">
                <Search size={15} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, tag, or owner"
                  autoFocus
                />
              </label>
            )}
            <label className="repository-filter">
              <Filter size={14} />
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                aria-label="Filter content type"
              >
                <option value="all">All types</option>
                <option value="document">Documents</option>
                <option value="folder">Folders</option>
              </select>
              <ChevronDown size={13} />
            </label>
            <div className="repository-view-toggle">
              <button
                type="button"
                className={!gridView ? 'active' : ''}
                aria-label="List view"
                onClick={() => setGridView(false)}
              >
                <List size={16} />
              </button>
              <button
                type="button"
                className={gridView ? 'active' : ''}
                aria-label="Grid view"
                onClick={() => setGridView(true)}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
            <button
              type="button"
              className={`icon-button${propertiesOpen ? ' selected' : ''}`}
              aria-label="Toggle properties"
              onClick={() => setPropertiesOpen((open) => !open)}
            >
              <PanelRight size={16} />
            </button>
          </div>
        </div>
        {view === 'search' && !query.trim() ? (
          <div className="repository-empty">
            <Search size={25} />
            <h2>Search your repository</h2>
            <p>Enter a name, owner, or tag above to find content.</p>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="repository-empty">
            <Folder size={25} />
            <h2>
              {view === 'trash' ? 'Trash is empty' : 'No matching content'}
            </h2>
            <p>
              {view === 'my-files'
                ? 'Create a folder or upload a document to get started.'
                : 'Adjust your search or filters and try again.'}
            </p>
          </div>
        ) : (
          <div
            className={`repository-content${propertiesOpen ? '' : ' without-details'}`}
          >
            <div className="repository-list-wrap">
              {gridView ? (
                <div className="repository-grid">
                  {visibleItems.map((item) => (
                    <RepositoryCard
                      key={item.id}
                      item={item}
                      selected={selectedId === item.id}
                      onSelect={() => setSelectedId(item.id)}
                      onOpen={() =>
                        item.kind === 'folder'
                          ? setFolderId(item.id)
                          : openDialog('preview', item)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table repository-table mb-0">
                    <thead>
                      <tr>
                        <th className="select-cell">
                          <input
                            aria-label="Select all"
                            type="checkbox"
                            checked={
                              visibleItems.length > 0 &&
                              visibleItems.every((item) =>
                                selectedIds.includes(item.id),
                              )
                            }
                            onChange={(event) =>
                              setSelectedIds(
                                event.target.checked
                                  ? visibleItems.map((item) => item.id)
                                  : [],
                              )
                            }
                          />
                        </th>
                        <th>Name</th>
                        <th>
                          <button
                            type="button"
                            onClick={() =>
                              setSortKey(
                                sortKey === 'name' ? 'updatedAt' : 'name',
                              )
                            }
                          >
                            Modified <CalendarDays size={13} />
                          </button>
                        </th>
                        <th>Owner</th>
                        <th>Size</th>
                        <th aria-label="Actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {visibleItems.map((item) => (
                        <tr
                          key={item.id}
                          className={
                            selectedId === item.id ? 'selected-row' : ''
                          }
                          onClick={() => setSelectedId(item.id)}
                        >
                          <td
                            className="select-cell"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <input
                              aria-label={`Select ${item.name}`}
                              type="checkbox"
                              checked={selectedIds.includes(item.id)}
                              onChange={() =>
                                setSelectedIds((current) =>
                                  current.includes(item.id)
                                    ? current.filter((id) => id !== item.id)
                                    : [...current, item.id],
                                )
                              }
                            />
                          </td>
                          <td>
                            <div className="repository-item-name">
                              <DocumentIcon item={item} />
                              <button
                                type="button"
                                className="repository-name-button"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  if (item.kind === 'folder') {
                                    setFolderId(item.id)
                                  } else {
                                    openDialog('preview', item)
                                  }
                                }}
                              >
                                {item.name}
                              </button>
                              {item.shared && (
                                <span
                                  className="table-muted-icon"
                                  title="Shared"
                                >
                                  <UsersRound size={13} />
                                </span>
                              )}
                              {item.starred && (
                                <Star
                                  className="starred-icon"
                                  size={12}
                                  fill="currentColor"
                                />
                              )}
                            </div>
                          </td>
                          <td className="table-secondary">
                            {formatDate(item.updatedAt)}
                          </td>
                          <td className="table-secondary">{item.owner}</td>
                          <td className="table-secondary">
                            {formatBytes(item.size)}
                          </td>
                          <td
                            className="repository-actions"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {view === 'trash' ? (
                              <button
                                type="button"
                                className="icon-button"
                                aria-label={`Restore ${item.name}`}
                                onClick={() => restore(item)}
                              >
                                <ArchiveRestore size={16} />
                              </button>
                            ) : (
                              <div className="repository-menu-anchor">
                                <button
                                  type="button"
                                  className="icon-button row-menu-trigger"
                                  aria-label={`Actions for ${item.name}`}
                                  onClick={() =>
                                    setOpenMenuId((current) =>
                                      current === item.id ? null : item.id,
                                    )
                                  }
                                >
                                  <MoreHorizontal size={17} />
                                </button>
                                {openMenuId === item.id && (
                                  <div className="repository-row-menu">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openDialog('preview', item)
                                      }
                                    >
                                      <Eye size={14} />
                                      Preview
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openDialog('metadata', item)
                                      }
                                    >
                                      <Tag size={14} />
                                      Edit metadata
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openDialog('versions', item)
                                      }
                                    >
                                      <History size={14} />
                                      Version history
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openDialog('comments', item)
                                      }
                                    >
                                      <MessageCircle size={14} />
                                      Comments
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openDialog('share', item)}
                                    >
                                      <Share2 size={14} />
                                      Share
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        toggleStar(item.id)
                                        setOpenMenuId(null)
                                      }}
                                    >
                                      <Star size={14} />
                                      {item.starred
                                        ? 'Remove favorite'
                                        : 'Add favorite'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openDialog('rename', item)}
                                    >
                                      <Pencil size={14} />
                                      Rename
                                    </button>
                                    <button
                                      type="button"
                                      className="danger-item"
                                      onClick={() => openDialog('delete', item)}
                                    >
                                      <Trash2 size={14} />
                                      Move to trash
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {propertiesOpen && (
              <RepositoryDetails
                item={items.find(
                  (item) => item.id === selectedId && !item.trashed,
                )}
                onAction={openDialog}
                onStar={toggleStar}
              />
            )}
          </div>
        )}
      </section>

      <Modal
        open={dialog === 'create-folder'}
        title="Create a folder"
        description="Add a new folder to this location."
        onClose={closeDialog}
        footer={modalFooter('Create folder')}
      >
        <form
          id="repository-dialog-form"
          onSubmit={createFolder}
          className="feature-form"
        >
          <label>
            Folder name
            <input
              autoFocus
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
              placeholder="e.g. Research materials"
              maxLength={100}
              required
            />
          </label>
          <label>
            Description <span className="form-optional">Optional</span>
            <textarea
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
              placeholder="What belongs in this folder?"
              rows={3}
            />
          </label>
        </form>
      </Modal>
      <Modal
        open={dialog === 'rename'}
        title="Rename item"
        description="The new name will be used throughout this workspace."
        onClose={closeDialog}
        footer={modalFooter('Save changes')}
      >
        <form
          id="repository-dialog-form"
          onSubmit={renameItem}
          className="feature-form"
        >
          <label>
            New name
            <input
              autoFocus
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
              maxLength={160}
              required
            />
          </label>
        </form>
      </Modal>
      <Modal
        open={dialog === 'upload'}
        title="Upload documents"
        description="Choose files to list in the current folder. This frontend preview does not store file contents."
        onClose={closeDialog}
      >
        <div
          className="upload-drop-area"
          onClick={() => uploadRef.current?.click()}
        >
          <input ref={uploadRef} type="file" multiple onChange={handleUpload} />
          <Upload size={25} />
          <strong>Choose files from your device</strong>
          <span>Maximum 50 MB per file</span>
        </div>
        <div className="upload-safety-note">
          Files are only listed in this browser session. Private object storage
          will be connected later.
        </div>
      </Modal>
      <Modal
        open={dialog === 'share'}
        title="Share document"
        description="Manage who can access this item in the local preview."
        onClose={closeDialog}
        footer={modalFooter('Share')}
      >
        <form
          id="repository-dialog-form"
          onSubmit={shareItem}
          className="feature-form"
        >
          <div className="share-target">
            <DocumentIcon item={activeItem} />
            <strong>{activeItem?.name}</strong>
          </div>
          <label>
            Invite by email
            <input
              autoFocus
              type="email"
              value={shareEmail}
              onChange={(event) => setShareEmail(event.target.value)}
              placeholder="colleague@company.com"
              required
            />
          </label>
          <label>
            Permission
            <select
              value={sharePermission}
              onChange={(event) => setSharePermission(event.target.value)}
            >
              <option>Can view</option>
              <option>Can comment</option>
              <option>Can edit</option>
            </select>
          </label>
          <p className="modal-note">
            Access changes are simulated and are not enforced by a backend.
          </p>
        </form>
      </Modal>
      <Modal
        open={dialog === 'metadata'}
        title="Document metadata"
        description="Update searchable details for this repository item."
        onClose={closeDialog}
        footer={modalFooter('Save metadata')}
      >
        <form
          id="repository-dialog-form"
          onSubmit={saveMetadata}
          className="feature-form"
        >
          <label>
            Description
            <textarea
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
              rows={3}
              maxLength={500}
            />
          </label>
          <label>
            Tags <span className="form-optional">Separate with commas</span>
            <input
              value={tagsValue}
              onChange={(event) => setTagsValue(event.target.value)}
              placeholder="Finance, Q4, Approved"
            />
          </label>
          <label>
            Classification
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
        open={dialog === 'preview'}
        title={activeItem?.name ?? 'Document preview'}
        description="Document overview and repository metadata."
        onClose={closeDialog}
        size="wide"
      >
        {activeItem && (
          <div className="document-preview-modal">
            <div className="preview-paper">
              <DocumentIcon item={activeItem} />
              <h3>{activeItem.name}</h3>
              <p>{activeItem.description}</p>
              <div className="preview-paper-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <small>
                File contents are not available in the frontend demo.
              </small>
            </div>
            <div className="preview-metadata">
              <h3>Properties</h3>
              <MetadataLine label="Owner" value={activeItem.owner} />
              <MetadataLine
                label="Updated"
                value={formatDateTime(activeItem.updatedAt)}
              />
              <MetadataLine label="Size" value={formatBytes(activeItem.size)} />
              <MetadataLine label="Version" value={`v${activeItem.version}`} />
              <MetadataLine
                label="Location"
                value={
                  activeItem.folderId
                    ? (items.find((item) => item.id === activeItem.folderId)
                        ?.name ?? 'My Files')
                    : 'My Files'
                }
              />
              <div className="metadata-tags">
                {activeItem.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => openDialog('versions', activeItem)}
              >
                <History size={14} />
                View version history
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={dialog === 'versions'}
        title="Version history"
        description={`${activeItem?.name ?? 'Document'} · Previous versions are preserved in this demo record.`}
        onClose={closeDialog}
      >
        <div className="version-timeline">
          {Array.from(
            { length: Math.max(1, activeItem?.version ?? 1) },
            (_, index) => {
              const version = (activeItem?.version ?? 1) - index
              return (
                <div
                  className={`version-row${index === 0 ? ' current-version' : ''}`}
                  key={version}
                >
                  <span className="version-dot">
                    {index === 0 ? <Check size={12} /> : <History size={12} />}
                  </span>
                  <div>
                    <strong>
                      Version {version}
                      {index === 0 ? ' · Current' : ''}
                    </strong>
                    <small>
                      {formatDateTime(
                        index === 0
                            ? (activeItem?.updatedAt ?? '2026-10-24T12:00:00.000Z')
                          : new Date(
                              new Date(
                              activeItem?.updatedAt ?? '2026-10-24T12:00:00.000Z',
                              ).getTime() -
                                index * 86400000,
                            ).toISOString(),
                      )}{' '}
                      · {index % 2 === 0 ? activeItem?.owner : 'Jamie Lee'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="text-action"
                    onClick={() =>
                      notify(`Version ${version} selected for preview`)
                    }
                  >
                    Preview
                  </button>
                </div>
              )
            },
          )}
        </div>
      </Modal>
      <Modal
        open={dialog === 'comments'}
        title="Comments"
        description={`Collaboration thread for ${activeItem?.name ?? 'this item'}.`}
        onClose={closeDialog}
      >
        <div className="comment-thread">
          {(activeItem ? (comments[activeItem.id] ?? []) : []).length === 0 ? (
            <div className="comment-empty">
              No comments yet. Start a conversation about this item.
            </div>
          ) : (
            (activeItem ? (comments[activeItem.id] ?? []) : []).map(
              (comment) => (
                <div className="comment-entry" key={comment.id}>
                  <span className="comment-avatar">AM</span>
                  <div>
                    <div className="comment-meta">
                      <strong>{comment.author}</strong>
                      <small>{formatRelativeDate(comment.createdAt)}</small>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ),
            )
          )}
        </div>
        <form className="comment-composer" onSubmit={addComment}>
          <textarea
            aria-label="Write a comment"
            rows={3}
            value={commentValue}
            onChange={(event) => setCommentValue(event.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button className="btn btn-primary btn-sm" type="submit">
            Post comment
          </button>
        </form>
      </Modal>
      <Modal
        open={dialog === 'delete'}
        title={
          dialogItemId
            ? 'Move item to trash?'
            : `Move ${selectedIds.length} items to trash?`
        }
        description="Items in trash can be restored later in this demo."
        onClose={closeDialog}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmTrash}
            >
              Move to trash
            </button>
          </>
        }
      >
        {dialogItemId && (
          <div className="delete-confirm-item">
            <DocumentIcon item={activeItem} />
            <strong>{activeItem?.name}</strong>
          </div>
        )}
      </Modal>
      <Modal
        open={dialog === 'restore'}
        title="Restore this item?"
        description="The item will return to its original repository location."
        onClose={closeDialog}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmRestore}
            >
              <ArchiveRestore size={14} />
              Restore item
            </button>
          </>
        }
      >
        {activeItem && (
          <div className="delete-confirm-item">
            <DocumentIcon item={activeItem} />
            <strong>{activeItem.name}</strong>
          </div>
        )}
      </Modal>
      <Modal
        open={dialog === 'move'}
        title="Move item"
        description="Choose a destination folder in the current repository."
        onClose={closeDialog}
        footer={modalFooter('Move item')}
      >
        <form
          id="repository-dialog-form"
          onSubmit={moveItem}
          className="feature-form"
        >
          <div className="share-target">
            <DocumentIcon item={activeItem} />
            <strong>{activeItem?.name}</strong>
          </div>
          <label>
            Destination folder
            <select
              value={targetFolderId}
              onChange={(event) => setTargetFolderId(event.target.value)}
            >
              <option value="root">My Files (root)</option>
              {items
                .filter(
                  (item) =>
                    item.kind === 'folder' &&
                    !item.trashed &&
                    item.id !== activeItem?.id,
                )
                .map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
            </select>
          </label>
          <p className="modal-note">
            Moves are applied to this browser session only.
          </p>
        </form>
      </Modal>
      <Modal
        open={dialog === 'copy'}
        title="Copy item"
        description="Create a separate demo record in the selected destination."
        onClose={closeDialog}
        footer={modalFooter('Create copy')}
      >
        <form
          id="repository-dialog-form"
          onSubmit={copyItem}
          className="feature-form"
        >
          <div className="share-target">
            <DocumentIcon item={activeItem} />
            <strong>{activeItem?.name}</strong>
          </div>
          <label>
            Destination folder
            <select
              value={targetFolderId}
              onChange={(event) => setTargetFolderId(event.target.value)}
            >
              <option value="root">My Files (root)</option>
              {items
                .filter(
                  (item) =>
                    item.kind === 'folder' &&
                    !item.trashed &&
                    item.id !== activeItem?.id,
                )
                .map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
            </select>
          </label>
          <p className="modal-note">
            The copied record keeps metadata; binary content is not stored in
            this frontend preview.
          </p>
        </form>
      </Modal>
      <Modal
        open={dialog === 'download'}
        title="Download document"
        description="Private document downloads require an authorized storage service."
        onClose={closeDialog}
      >
        <div className="download-preview">
          <DocumentIcon item={activeItem} />
          <div>
            <strong>{activeItem?.name}</strong>
            <small>
              {formatBytes(activeItem?.size ?? null)} · Version{' '}
              {activeItem?.version}
            </small>
          </div>
        </div>
        <div className="upload-safety-note">
          This preview contains metadata only. Download will become available
          after private Supabase Storage and authorization are connected.
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

function RepositoryDetails({
  item,
  onAction,
  onStar,
}: {
  item?: RepositoryRecord
  onAction: (kind: Exclude<DialogKind, null>, item?: RepositoryRecord) => void
  onStar: (id: string) => void
}) {
  if (!item)
    return (
      <aside className="repository-details">
        <div className="repository-details-head">
          <strong>Details</strong>
          <span>Nothing selected</span>
        </div>
      </aside>
    )
  return (
    <aside className="repository-details">
      <div className="repository-details-head">
        <strong>Details</strong>
        <span>Updated {formatDate(item.updatedAt)}</span>
      </div>
      <div className="repository-detail-file">
        <DocumentIcon item={item} />
        <strong>{item.name}</strong>
        <StatusBadge status={item.shared ? 'Shared' : 'Private'} />
        <div className="repository-detail-actions">
          <button type="button" onClick={() => onStar(item.id)}>
            <Star size={14} fill={item.starred ? 'currentColor' : 'none'} />
            {item.starred ? 'Saved' : 'Save'}
          </button>
          <button type="button" onClick={() => onAction('share', item)}>
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
      <section className="repository-detail-section">
        <h3>Information</h3>
        <MetadataLine label="Owner" value={item.owner} />
        <MetadataLine label="Modified" value={formatDateTime(item.updatedAt)} />
        <MetadataLine label="File size" value={formatBytes(item.size)} />
        <MetadataLine label="Version" value={`v${item.version}`} />
        <MetadataLine
          label="Location"
          value={item.folderId ? 'Projects' : 'My Files'}
        />
      </section>
      <section className="repository-detail-section">
        <h3>Description</h3>
        <p className="repository-description">{item.description}</p>
      </section>
      <section className="repository-detail-section">
        <h3>Tags</h3>
        <div className="metadata-tags">
          {item.tags.length ? (
            item.tags.map((tag) => <span key={tag}>{tag}</span>)
          ) : (
            <span className="muted-tag">No tags</span>
          )}
        </div>
      </section>
      <section className="repository-detail-section">
        <h3>Quick actions</h3>
        <button
          type="button"
          className="repository-detail-link"
          onClick={() => onAction('versions', item)}
        >
          <History size={14} />
          Version history
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className="repository-detail-link"
          onClick={() => onAction('comments', item)}
        >
          <MessageCircle size={14} />
          Comments
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className="repository-detail-link"
          onClick={() => onAction('metadata', item)}
        >
          <Tag size={14} />
          Edit metadata
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className="repository-detail-link"
          onClick={() => onAction('move', item)}
        >
          <MoveRight size={14} />
          Move
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className="repository-detail-link"
          onClick={() => onAction('copy', item)}
        >
          <Copy size={14} />
          Make a copy
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className="repository-detail-link"
          onClick={() => onAction('download', item)}
        >
          <Download size={14} />
          Download
          <ChevronRight size={14} />
        </button>
      </section>
    </aside>
  )
}

function RepositoryCard({
  item,
  selected,
  onSelect,
  onOpen,
}: {
  item: RepositoryRecord
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}) {
  return (
    <article className={`repository-grid-card${selected ? ' active' : ''}`}>
      <button type="button" className="grid-card-icon" onClick={onOpen}>
        <DocumentIcon item={item} />
      </button>
      <button
        type="button"
        className="grid-card-select"
        aria-label={`Select ${item.name}`}
        onClick={onSelect}
      >
        <MoreHorizontal size={16} />
      </button>
      <button type="button" className="grid-card-name" onClick={onOpen}>
        {item.name}
      </button>
      <div>
        <span>
          {item.kind === 'folder' ? 'Folder' : formatBytes(item.size)}
        </span>
        <span>{formatDate(item.updatedAt)}</span>
      </div>
    </article>
  )
}

function DocumentIcon({ item }: { item?: RepositoryRecord }) {
  if (!item || item.kind === 'folder')
    return (
      <span className="repository-file-icon folder-file-icon">
        <Folder size={18} fill="currentColor" />
      </span>
    )
  const extension = item.name.split('.').pop()?.toLowerCase()
  if (extension === 'xlsx' || extension === 'csv')
    return (
      <span className="repository-file-icon sheet-file-icon">
        <FileSpreadsheet size={18} />
      </span>
    )
  if (['png', 'jpg', 'jpeg', 'svg'].includes(extension ?? ''))
    return (
      <span className="repository-file-icon image-file-icon">
        <FileImage size={18} />
      </span>
    )
  if (extension === 'pdf')
    return (
      <span className="repository-file-icon pdf-file-icon">
        <FileText size={18} />
      </span>
    )
  return (
    <span className="repository-file-icon text-file-icon">
      <FileText size={18} />
    </span>
  )
}

function MetadataLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="metadata-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatRelativeDate(value: string) {
  const date = new Date(value)
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}
