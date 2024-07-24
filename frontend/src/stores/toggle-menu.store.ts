import { create } from 'zustand'

interface State {
  open: boolean
}

interface Actions {
  toggle: () => void
  setOpen: (value: boolean) => void
}

const useSidebarStore = create<State & Actions>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
  toggle: () =>
    set((state) => ({
      open: !state.open
    }))
}))

export default useSidebarStore
