import { useContext } from 'react'
import { DemoDataContext } from './demoDataContext'

export function useDemoData() {
  const value = useContext(DemoDataContext)
  if (!value) throw new Error('useDemoData must be used within DemoDataProvider')
  return value
}