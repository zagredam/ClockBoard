import { useState, useEffect } from 'react'

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ,.0123456789".split("")
export default function FlipDigit({ digit, fastFlip = false,flipThroughLetters = false }) {
  const [topDigit, setTopDigit] = useState(!isNaN(digit) && !flipThroughLetters ? digit : letters[0])      // static top half (new digit)
  const [bottomDigit, setBottomDigit] = useState(!isNaN(digit) && !flipThroughLetters ? digit : letters[0]) // static bottom half (lags)
  const [leafDigit, setLeafDigit] = useState(!isNaN(digit) && !flipThroughLetters ? digit : letters[0])    // fold leaf (old digit folding away)
  const [phase, setPhase] = useState('idle') // 'idle' | 'folding' | 'unfolding'
  const [prevDigitRef, setPrevDigitRef] = useState(0);

  useEffect(() => {
    if (phase !== 'idle' || (""+digit) === (""+topDigit)) return
    if(!isNaN(digit) && !flipThroughLetters){
    setLeafDigit(topDigit)  // leaf shows old digit folding away
    setTopDigit(digit)      // top static immediately updates to new digit
    setPhase('folding')
    }
    else if(topDigit != (""+digit) ){      
      setTimeout(() => {
        const newPointer = prevDigitRef+1 > letters.length-1 ? 0 : prevDigitRef+1;
        setLeafDigit(letters[newPointer])  // leaf shows old digit folding away
        setTopDigit(letters[newPointer])      // top static immediately updates to new digit
        setPhase('folding');
        setPrevDigitRef(newPointer);
      }, 60)

    }
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
          style={fastFlip ? { animationDuration: '0.05s' } :  {}}
          onAnimationEnd={() => setPhase('unfolding')}
        >
          <div className="fd-inner">{leafDigit}</div>
        </div>
      )}

      {/* Unfolding leaf: new digit on bottom half, unfolds from flat */}
      {phase === 'unfolding' && (
        <div
          className="fd-leaf fd-bottom fd-unfold-anim"
          style={fastFlip ? { animationDuration: '0.05s' } :  {}}
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
