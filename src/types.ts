export type SceneId = 'hero' | 'services' | 'why-ai' | 'case-studies' | 'contact'

export interface NavItem {
  id: SceneId
  label: string
  shortLabel?: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home', shortLabel: 'Home' },
  { id: 'services', label: 'Services', shortLabel: 'Services' },
  { id: 'why-ai', label: 'Why AI-Era Security', shortLabel: 'Why AI' },
  { id: 'case-studies', label: 'Case Studies', shortLabel: 'Cases' },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact' },
]
