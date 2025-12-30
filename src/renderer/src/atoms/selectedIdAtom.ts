import { atom } from 'jotai'

export const selectedIdAtom = atom<string>('helloworld')

export const targetIdAtom = atom<string | null>(null)
