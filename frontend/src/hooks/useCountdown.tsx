import { useEffect, useRef, useState } from 'react'

function useCountdown(expiresAt: number): { isTimeout: boolean; time: number } {
  const [countdown, setCountdown] = useState<number>(expiresAt)
  const countdownRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (expiresAt !== 0) {
      const now = Date.now()
      const duration = expiresAt - now
      const time = Math.floor(duration / 1000)
      setCountdown(time)
    }
  }, [expiresAt])

  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (countdown <= 0) {
      clearInterval(countdownRef.current)
    }

    return () => clearInterval(countdownRef.current)
  }, [countdown, expiresAt])

  return {
    isTimeout: countdown <= 0,
    time: countdown
  }
}

export default useCountdown
