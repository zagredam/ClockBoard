import { useState, useEffect } from 'react'
import '../styles/hourglass.css'
import { useSettings } from '../context/SettingsContext'


export default function Hourglass() {
  const [time, setTime] = useState(new Date());
  const { hourglassInterval,showSeconds, showMeridum } = useSettings()
  const [rotate, setRotate] = useState(false);
  const getProgress = (suppliedTime) => {
    const seconds = suppliedTime.getSeconds();
    const minutes = suppliedTime.getMinutes();
    switch(hourglassInterval){
      case "yearly":
        return .6;
      case "monthly":
        return .4;
      case "60":
        return seconds / 60;
      case "3600":
        return ((minutes*60) + seconds) / 3600;
      case "86400":
        const hours = suppliedTime.getHours();
        return ((hours*3600) + (minutes*60) + seconds) / 86400;
      default:  
        return (((minutes*60)+seconds) % Number(hourglassInterval)) / Number(hourglassInterval);
    }
  };
  const intervalTime = 200;
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      if(getProgress(new Date()) > getProgress(new Date(new Date().getTime() + intervalTime )) ){
        setRotate(true);
        setTimeout(()=>{setRotate(false)},1200);
      }
    }, intervalTime)
    return () => clearInterval(interval)
  }, [hourglassInterval])

  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // progress: 0 at top of hour (no sand in bottom), 1 at end of hour (all sand in bottom)
  const progress = rotate ? 1 : getProgress(time) ;//(minutes * 60 + seconds) / 3600

  // sq drives both surface positions — sqrt gives volumetrically correct sand level
  // (triangle area scales as h², so h = sqrt(fraction) * total_h)
  const sq = Math.sqrt(1 - progress);

  // SVG coordinate constants
  const CAP_TOP = 10     // bottom edge of top cap
  const APEX_TOP = 118  // top chamber apex (top of neck)
  const APEX_BOT = 118  // bottom chamber apex (bottom of neck)
  const CAP_BOT = 225   // top edge of bottom cap
  const MID = 50        // center x
  const HW = 42         // half-width of chambers at caps
  const TOP_H = APEX_TOP - CAP_TOP   // 97
  const BOT_H = CAP_BOT - APEX_BOT   // 97

  // Top sand: surface starts at CAP_TOP (full) and descends to APEX_TOP (empty)
  const ys_top = APEX_TOP - TOP_H * sq
  const hw_top = HW * sq   // half-width of sand at its surface

  // Bottom sand: surface starts at CAP_BOT (empty) and rises to APEX_BOT (full)
  const ys_bot = APEX_BOT + BOT_H * sq
  const hw_bot = HW * sq

  const h = time.getHours() % 12 || 12;
  const m = String(minutes).padStart(2, '0');


  const flowing = !rotate && progress > 0 && progress < 1;

  return (
    <div className="hourglass-bg">
      <svg viewBox="0 0 100 236" className="hourglass-svg" style={rotate ? {transform:"rotate(180deg)"} : {transition:"none"}}>

        {/* ── Sand ────────────────────────────────────── */}

        {/* Top sand: triangle from surface down to neck apex */}
        <polygon
          points={`${MID - hw_top},${ys_top} ${MID + hw_top},${ys_top} ${MID},${APEX_TOP}`}
          className="hg-sand"
        />

        {/* Bottom sand: trapezoid from surface down to base */}
        <polygon
          points={`${MID - hw_bot},${ys_bot} ${MID + hw_bot},${ys_bot} ${MID + HW},${CAP_BOT} ${MID - HW},${CAP_BOT}`}
          className="hg-sand"
        />



        {/* ── Glass frame ─────────────────────────────── */}

        {/* Top cap — pill-shaped (rx = half height) */}
         <rect x={MID - HW - 2} y={3} width={(HW + 2) * 2} height={10}
              rx="4" className="hg-cap" />

        {/* Bottom cap — pill-shaped */}
        <rect x={MID - HW - 2} y={221} width={(HW + 2) * 2} height={10}
              rx="4" className="hg-cap" /> 

        {/* Top chamber walls — bezier curves blend smoothly into caps */}
        {/* Path starts inside cap fill, curves through wall-cap junction, then straight to apex . Slope of 2.6 */}
        <path d="M 8,10 L 48,114.4" className="hg-wall" />
        <path d="M 92,10 L 52,114.4" className="hg-wall" />
        <path d="M 48,114.4 Q 49.5 115.7 48 118" className="hg-wall" />
        <path d="M 52,114.4 Q 50.5 115.7 52 118" className="hg-wall" />

        {/* Bottom chamber walls */}
        <path d="M 8,225 L 48,121.6 " className="hg-wall" />
        <path d="M 92,225 L 52,121.6 " className="hg-wall" />
        <path d="M 48,121.6 Q 49.5 120.3 48 118" className="hg-wall" />
        <path d="M 52,121.6 Q 50.5 120.3 52 118" className="hg-wall" />
        

        

                {/* Sand stream through neck */}
        {flowing && (
          <rect
            x={MID - 0.8} y={APEX_TOP-1}
            width={1.6} height={(ys_bot-116.5)}
            className="hg-stream"
          />
        )}

      </svg>
        {/* ── Time label ──────────────────────────────── */}
        <div className="hg-time">
          {h}:{m}{showSeconds ? `:${String(seconds).padStart(2, '0')}` : ''} {showMeridum && (time.getHours() >= 12 ? 'PM' : 'AM')}
        </div>
    </div>
  )
}
