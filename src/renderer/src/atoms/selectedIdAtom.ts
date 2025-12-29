import { atom } from 'jotai'

export const selectedIdAtom = atom<string>('default')

export const targetIdAtom = atom<string | null>(null)
