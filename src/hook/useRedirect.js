'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useRedirect() {
  const router = useRouter()

  // Redirect immediately
  const redirectTo = useCallback((path) => {
    router.push(path)
  }, [router])

  // Redirect with delay
  const redirectAfter = useCallback((path, delay) => {
    setTimeout(() => {
      router.push(path)
    }, delay)
  }, [router])

  // Replace instead of push (no history entry)
  const replaceTo = useCallback((path) => {
    router.replace(path)
  }, [router])

  return { redirectTo, redirectAfter, replaceTo }
}
