import { useState } from 'react'

function useBoolean(defaultValue?: boolean | (() => boolean)) {
  const [value, setValue] = useState<boolean>(defaultValue || false)

  const setTrue = () => {
    setValue(true)
  }
  const setFalse = () => {
    setValue(false)
  }

  const toggle = () => {
    setValue((prev) => !prev)
  }
  return {
    value,
    setValue,
    setTrue,
    setFalse,
    toggle
  }
}

export default useBoolean
