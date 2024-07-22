import { createContext, ReactNode } from 'react'
import useBoolean from '../hooks/useBoolean'

export interface IToggleMenu {
  toggle: () => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
}

const inititalState: IToggleMenu = {
  open: false,
  setOpen: () => null,
  toggle: () => null
}

export const ToggleContext = createContext(inititalState)

export const ToggleMenuProvider = ({ children }: { children: ReactNode }) => {
  const { value: open, toggle, setValue: setOpen } = useBoolean(inititalState.open)

  return (
    <ToggleContext.Provider
      value={{
        open,
        setOpen,
        toggle
      }}
    >
      {children}
    </ToggleContext.Provider>
  )
}
