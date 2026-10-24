import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type {
  DemoActivity,
  DemoGroup,
  DemoLibrary,
  DemoMember,
  DemoNotification,
  DemoTask,
  DemoWorkspace,
  RepositoryRecord,
} from './types'

export type DemoDataValue = {
  items: RepositoryRecord[]
  setItems: Dispatch<SetStateAction<RepositoryRecord[]>>
  tasks: DemoTask[]
  setTasks: Dispatch<SetStateAction<DemoTask[]>>
  notifications: DemoNotification[]
  setNotifications: Dispatch<SetStateAction<DemoNotification[]>>
  activity: DemoActivity[]
  workspaces: DemoWorkspace[]
  setWorkspaces: Dispatch<SetStateAction<DemoWorkspace[]>>
  libraries: DemoLibrary[]
  setLibraries: Dispatch<SetStateAction<DemoLibrary[]>>
  members: DemoMember[]
  setMembers: Dispatch<SetStateAction<DemoMember[]>>
  groups: DemoGroup[]
  setGroups: Dispatch<SetStateAction<DemoGroup[]>>
  isAuthenticated: boolean
  signIn: (email: string, password: string) => boolean
  signOut: () => void
}

export const DemoDataContext = createContext<DemoDataValue | null>(null)