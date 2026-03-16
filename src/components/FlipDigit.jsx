import { useState, useEffect } from 'react'

export default function FlipDigit({ digit }) {
  const [topDigit, setTopDigit] = useState(digit)      // static top half (new digit)
  const [bottomDigit, setBottomDigit] = useState(digit) // static bottom half (lags)
  const [leafDigit, setLeafDigit] = useState(digit)    // fold leaf (old digit folding away)
  const [phase, setPhase] = useState('idle') // 'idle' | 'folding' | 'unfolding'

  useEffect(() => {
    if (phase !== 'idle' || digit === topDigit) return
    setLeafDigit(topDigit)  // leaf shows old digit folding away
    setTopDigit(digit)      // top static immediately updates to new digit
    setPhase('folding')
  }, [digit, phase, topDigit])

  return (
    <div className="fd-wrap">
      {/* Static top half — shows new digit (revealed when fold leaf folds away) */}
      <div className="fd-half fd-top">
        <div className="fd-inner">{topDigit}</div>
      </div>

      {/* Static bottom half — shows old digit until unfold leaf replaces it */}
      <div className="fd-half fd-bottom">
        <div className="fd-inner">{bottomDigit}</div>
      </div>

      {/* Folding leaf: old digit on top half, folds down */}
      {phase === 'folding' && (
        <div
          className="fd-leaf fd-top fd-fold-anim"
          onAnimationEnd={() => setPhase('unfolding')}
        >
          <div className="fd-inner">{leafDigit}</div>
        </div>
      )}

      {/* Unfolding leaf: new digit on bottom half, unfolds from flat */}
      {phase === 'unfolding' && (
        <div
          className="fd-leaf fd-bottom fd-unfold-anim"
          onAnimationEnd={() => {
            setBottomDigit(topDigit)
            setPhase('idle')
          }}
        >
          <div className="fd-inner">{topDigit}</div>
        </div>
      )}
    </div>
  )
}
