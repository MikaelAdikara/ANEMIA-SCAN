import {
  Activity,
  BookOpen,
  ClipboardClock,
  ClipboardList,
  DatabaseZap,
  History,
  MapPinned,
  ScanLine,
} from 'lucide-react'
import type { ComponentType } from 'react'

export interface NavItem {
  to: string
  icon: ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' }>
  label: string
  end?: boolean
}

export const primaryNavigation: NavItem[] = [
  { to: '/screening', icon: Activity, label: 'Skrining baru' },
  { to: '/dashboard', icon: ClipboardList, label: 'Data wilayah' },
  { to: '/history', icon: History, label: 'Riwayat' },
  { to: '/evidence', icon: BookOpen, label: 'Kinerja model' },
]

export const workspaceNavigation: NavItem[] = [
  { to: '/screening', icon: ScanLine, label: 'Skrining baru' },
  { to: '/history', icon: History, label: 'Riwayat' },
  {
    to: '/dashboard#antrean-rujukan',
    icon: ClipboardClock,
    label: 'Antrean rujukan',
  },
]

export const insightNavigation: NavItem[] = [
  { to: '/dashboard', icon: MapPinned, label: 'Data wilayah', end: true },
  { to: '/evidence', icon: Activity, label: 'Kinerja model', end: true },
  {
    to: '/evidence#kualitas-data',
    icon: DatabaseZap,
    label: 'Kualitas data',
  },
]
