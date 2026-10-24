import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="feature-page-header">
      <div>
        {eyebrow && <span className="feature-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="feature-page-action">{action}</div>}
    </header>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const className = status.toLowerCase().replaceAll(' ', '-')
  return <span className={`status-badge status-${className}`}>{status}</span>
}
