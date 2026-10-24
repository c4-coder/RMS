import { useMemo, useState, type PropsWithChildren } from 'react'
import {
  demoActivity,
  demoCredentials,
  demoGroups,
  demoItems,
  demoLibraries,
  demoMembers,
  demoNotifications,
  demoTasks,
  demoWorkspaces,
} from './demoData'
import { DemoDataContext, type DemoDataValue } from './demoDataContext'

export function DemoDataProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState(demoItems)
  const [tasks, setTasks] = useState(demoTasks)
  const [notifications, setNotifications] = useState(demoNotifications)
  const [workspaces, setWorkspaces] = useState(demoWorkspaces)
  const [libraries, setLibraries] = useState(demoLibraries)
  const [members, setMembers] = useState(demoMembers)
  const [groups, setGroups] = useState(demoGroups)
  const [isAuthenticated, setAuthenticated] = useState(false)
  const value = useMemo<DemoDataValue>(
    () => ({
      items,
      setItems,
      tasks,
      setTasks,
      notifications,
      setNotifications,
      activity: demoActivity,
      workspaces,
      setWorkspaces,
      libraries,
      setLibraries,
      members,
      setMembers,
      groups,
      setGroups,
      isAuthenticated,
      signIn: (email, password) => {
        const valid =
          email.trim().toLowerCase() === demoCredentials.email &&
          password === demoCredentials.password
        if (valid) setAuthenticated(true)
        return valid
      },
      signOut: () => setAuthenticated(false),
    }),
    [
      groups,
      isAuthenticated,
      items,
      libraries,
      members,
      notifications,
      tasks,
      workspaces,
    ],
  )

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  )
}
