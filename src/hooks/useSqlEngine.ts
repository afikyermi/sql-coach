import { useCallback, useEffect, useState } from 'react'
import { initSql } from '../lib/sqlEngine'

export type SqlEngineStatus = 'loading' | 'ready' | 'error'

/**
 * Preloads the SQL engine (WASM) as soon as the calling page mounts, so it's
 * usually already ready by the time a student submits their first query —
 * this also naturally avoids the cold-start race where two concurrent queries
 * would otherwise each try to trigger the WASM load at once.
 */
export function useSqlEngine(): { status: SqlEngineStatus; retry: () => void } {
  const [status, setStatus] = useState<SqlEngineStatus>('loading')

  const load = useCallback(() => {
    setStatus('loading')
    initSql()
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { status, retry: load }
}
