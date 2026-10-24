import { createContext, useContext, useMemo, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from 'react'
import { demoActivity, demoCredentials, demoItems, demoMembers, demoNotifications, demoTasks, demoWorkspaces } from './demoData'
import type { DemoActivity, DemoMember, DemoNotification, DemoTask, DemoWorkspace, RepositoryRecord } from './types'

type DemoDataValue = {
  items: RepositoryRecord[]
  setItems: Dispatch<SetStateAction<RepositoryRecord[]>>
  tasks: DemoTask[]
  setTasks: Dispatch<SetStateAction<DemoTask[]>>
  notifications: DemoNotification[]
  setNotifications: Dispatch<SetStateAction<DemoNotification[]>>
  activity: DemoActivity[]
  workspaces: DemoWorkspace[]
  members: DemoMember[]
  isAuthenticated: boolean
  signIn: (email: string, password: string) => boolean
  signOut: () => void
}

const DemoDataContext = createContext<DemoDataValue | null>(null)

export function DemoDataProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState(demoItems)
  const [tasks, setTasks] = useState(demoTasks)
  const [notifications, setNotifications] = useState(demoNotifications)
  const [isAuthenticated, setAuthenticated] = useState(false)
  const value = useMemo<DemoDataValue>(() => ({
    items,
    setItems,
    tasks,
    setTasks,
    notifications,
    setNotifications,
    activity: demoActivity,
    workspaces: demoWorkspaces,
    members: demoMembers,
    isAuthenticated,
    signIn: (email, password) => {
      const valid = email.trim().toLowerCase() === demoCredentials.email && password === demoCredentials.password
      if (valid) setAuthenticated(true)
      return valid
    },
    signOut: () => setAuthenticated(false),
  }), [isAuthenticated, items, notifications, tasks])

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>
}

export function useDemoData() {
  const value = useContext(DemoDataContext)
  if (!value) throw new Error('useDemoData must be used within DemoDataProvider')
  return value
}