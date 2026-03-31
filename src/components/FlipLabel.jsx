import { useState, useEffect } from 'react'

const MAX_CHARS = 12

export default function FlipLabel({ label = '' }) {
  const display = label.slice(0, MAX_CHARS).toUpperCase()

  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [leafText, setLeafText] = useState('')
  const [phase, setPhase] = useState('idle') // 'idle' | 'folding' | 'unfolding'

  useEffect(() => {
    if (phase !== 'idle' || display === topText) return
    setLeafText(topText)
    setTopText(display)
    setPhase('folding')
  }, [display, phase, topText])

  return (
    <div className="fd-wrap fd-label">
      <div className="fd-half fd-top">
        <div className="fd-inner fd-label-inner">{topText}</div>
      </div>
      <div className="fd-half fd-bottom">
        <div className="fd-inner fd-label-inner">{bottomText}</div>
      </div>

      {phase === 'folding' && (
        <div className="fd-leaf fd-top fd-fold-anim" onAnimationEnd={() => setPhase('unfolding')}>
          <div className="fd-inner fd-label-inner">{leafText}</div>
        </div>
      )}

      {phase === 'unfolding' && (
        <div
          className="fd-leaf fd-bottom fd-unfold-anim"
          onAnimationEnd={() => { setBottomText(topText); setPhase('idle') }}
        >
          <div className="fd-inner fd-label-inner">{topText}</div>
        </div>
      )}
    </div>
  )
}
