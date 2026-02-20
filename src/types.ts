export type SceneId = 'hero' | 'services' | 'contact'

export interface NavItem {
  id: SceneId
  label: string
  shortLabel?: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home', shortLabel: 'Home' },
  { id: 'services', label: 'Services', shortLabel: 'Services' },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact' },
]
