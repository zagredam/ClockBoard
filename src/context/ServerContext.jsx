import { createContext, useContext, useState } from 'react'

const ServerContext = createContext(null)

function loadStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? JSON.parse(val) : fallback
  } catch { return fallback }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ServerProvider({ children }) {
  const [serverUrl, setServerUrlRaw] = useState(() => loadStorage('cb_serverUrl', ''))
  const [serverHeaders, setServerHeadersRaw] = useState(() => loadStorage('cb_serverHeaders', []))
  // serverHeaders: [{ key: string, value: string }]

  const isConnected = serverUrl.trim() !== ''

  const setServerUrl = (v) => { setServerUrlRaw(v); saveStorage('cb_serverUrl', v) }
  const setServerHeaders = (v) => { setServerHeadersRaw(v); saveStorage('cb_serverHeaders', v) }

  const serverRequest = async (method, path, body) => {
    if (!isConnected) return null
    const headers = { 'Content-Type': 'application/json' }
    serverHeaders.forEach(h => {
      if (h.key && h.key.trim()) headers[h.key.trim()] = h.value
    })
    const url = serverUrl.replace(/\/$/, '') + path
    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`Server responded with ${res.status}`)
    const text = await res.text()
    return text ? JSON.parse(text) : null
  }

  return (
    <ServerContext.Provider value={{
      serverUrl, setServerUrl,
      serverHeaders, setServerHeaders,
      isConnected,
      serverRequest,
    }}>
      {children}
    </ServerContext.Provider>
  )
}

export function useServerContext() {
  return useContext(ServerContext)
}
