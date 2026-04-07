import { useState, useEffect, useCallback } from 'react'
import { useServerContext } from '../context/ServerContext'
import '../styles/manager.css'

export default function Manager() {
  const { serverRequest, isConnected } = useServerContext()

  const [clients, setClients]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [fetchErr, setFetchErr] = useState(null)

  // Assignment form
  const [itemType, setItemType]   = useState('timer')
  const [minutes, setMinutes]     = useState('')
  const [seconds, setSeconds]     = useState('')
  const [label, setLabel]         = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())

  const [assigning, setAssigning]       = useState(false)
  const [assignResult, setAssignResult] = useState(null) // { ok, count? }

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setFetchErr(null)
    try {
      const data = await serverRequest('GET', '/manager')
      setClients(Array.isArray(data) ? data : [])
    } catch {
      setFetchErr('Failed to load clients.')
    } finally {
      setLoading(false)
    }
  }, [serverRequest])

  useEffect(() => {
    if (isConnected) fetchClients()
  }, [isConnected, fetchClients])

  const toggleClient = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const allSelected = clients.length > 0 && selectedIds.size === clients.length
  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(clients.map(c => c.ClientId)))
  }

  const handleAssign = async () => {
    if (selectedIds.size === 0) return
    setAssigning(true)
    setAssignResult(null)

    let itemPayload
    if (itemType === 'timer') {
      const timerValue = 60000 * (Number(minutes) || 0) + 1000 * (Number(seconds) || 0)
      if (timerValue <= 0) { setAssigning(false); return }
      itemPayload = { timer: { label, timerValue, timeToExp: Date.now() + timerValue, paused: false, timeLeft: null } }
    } else {
      itemPayload = { stopwatch: { label, paused: false, markedTime: Date.now(), pausedDiff: 0 } }
    }

    const body = [...selectedIds].map(ClientId => ({ ClientId, ...itemPayload }))

    try {
      await serverRequest('POST', '/manager/assign', body)
      setAssignResult({ ok: true, count: selectedIds.size })
    } catch {
      setAssignResult({ ok: false })
    } finally {
      setAssigning(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="manager-page">
        <p className="manager-empty">No server configured.</p>
      </div>
    )
  }

  return (
    <div className="manager-page">
      <div className="manager-header">
        <div className="manager-title">Manager</div>
        <button className="manager-refresh-btn" onClick={fetchClients} disabled={loading}>
          <i className={`fas fa-sync${loading ? ' fa-spin' : ''}`} />
          {' '}Refresh
        </button>
      </div>

      {fetchErr && <div className="manager-error">{fetchErr}</div>}

      {!loading && clients.length === 0 && !fetchErr && (
        <p className="manager-empty">No clients reported by server.</p>
      )}

      {(loading || clients.length > 0) && (
        <table className="manager-clients-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  title="Select all"
                />
              </th>
              <th>Name</th>
              <th>Client ID</th>
              <th>Key</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.ClientId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(c.ClientId)}
                    onChange={() => toggleClient(c.ClientId)}
                  />
                </td>
                <td>{c.ClientName}</td>
                <td style={{ fontFamily: 'monospace', opacity: 0.8 }}>{c.ClientId}</td>
                <td style={{ fontFamily: 'monospace', opacity: 0.6 }}>{c.ClientKey}</td>
                <td>
                  <span className={`manager-status-dot manager-status-dot--${c.ConnectedStatus ? 'connected' : 'disconnected'}`} />
                  {c.ConnectedStatus ? 'Connected' : 'Disconnected'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="manager-assign-section">
        <div className="manager-assign-title">Assign to {selectedIds.size > 0 ? `${selectedIds.size} client${selectedIds.size > 1 ? 's' : ''}` : 'selected clients'}</div>

        <div className="manager-assign-row">
          <button
            className={`manager-type-btn${itemType === 'timer' ? ' active' : ''}`}
            onClick={() => setItemType('timer')}
          >
            Timer
          </button>
          <button
            className={`manager-type-btn${itemType === 'stopwatch' ? ' active' : ''}`}
            onClick={() => setItemType('stopwatch')}
          >
            Stopwatch
          </button>
        </div>

        <div className="manager-assign-row">
          {itemType === 'timer' && (
            <>
              <input
                className="manager-input"
                placeholder="Min"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                type="number"
                min="0"
              />
              <span className="manager-sep">:</span>
              <input
                className="manager-input"
                placeholder="Sec"
                value={seconds}
                onChange={e => setSeconds(e.target.value)}
                type="number"
                min="0"
                max="59"
              />
            </>
          )}
          <input
            className="manager-input manager-input--label"
            placeholder="Label"
            value={label}
            onChange={e => setLabel(e.target.value)}
          />
          <button
            className="manager-assign-btn"
            onClick={handleAssign}
            disabled={assigning || selectedIds.size === 0}
          >
            {assigning ? 'Assigning…' : 'Assign'}
          </button>
        </div>

        {assignResult && (
          <div className={`manager-assign-result manager-assign-result--${assignResult.ok ? 'ok' : 'err'}`}>
            {assignResult.ok
              ? `Assigned to ${assignResult.count} client${assignResult.count > 1 ? 's' : ''}.`
              : 'Assignment failed.'}
          </div>
        )}
      </div>
    </div>
  )
}
