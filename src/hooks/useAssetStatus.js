import { useEffect, useState } from 'react'

export function useAssetStatus(url) {
  const [available, setAvailable] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let active = true

    async function checkAsset() {
      setChecked(false)
      try {
        const response = await fetch(url, { method: 'HEAD', cache: 'no-store' })
        const contentType = response.headers.get('content-type') || ''
        const looksLikeAsset = response.ok && !contentType.includes('text/html') && !contentType.includes('text/plain')
        if (active) setAvailable(looksLikeAsset)
      } catch {
        if (active) setAvailable(false)
      } finally {
        if (active) setChecked(true)
      }
    }

    checkAsset()

    return () => {
      active = false
    }
  }, [url])

  return { available, checked }
}
