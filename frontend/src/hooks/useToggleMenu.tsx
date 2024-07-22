import { useContext } from 'react'
import { IToggleMenu, ToggleContext } from '../contexts/toggle-menu.context'

function useToggleMenu() {
  return useContext<IToggleMenu>(ToggleContext)
}

export default useToggleMenu
