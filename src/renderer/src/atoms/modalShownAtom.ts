import { atom } from 'jotai'

export type DisplayModals = 'rename' | 'delete' | 'export'

export const modalShownAtom = atom<DisplayModals | null>(null)
