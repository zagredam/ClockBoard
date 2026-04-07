// slot order: [lt, lb, top, mid-left, mid-right, bot, rt, rb, center-top, center-bottom, diag-ul, diag-ur, diag-ll, diag-lr]
const digitNumberMapping = [
  [true,  true,  true,  false, false, true,  true,  true,  false, false, false, false, false, false], // 0
  [false, false, false, false, false, false, true,  true,  false, false, false, false, false, false], // 1
  [false, true,  true,  true,  true,  true,  true,  false, false, false, false, false, false, false], // 2
  [false, false, true,  true,  true,  true,  true,  true,  false, false, false, false, false, false], // 3
  [true,  false, false, true,  true,  false, true,  true,  false, false, false, false, false, false], // 4
  [true,  false, true,  true,  true,  true,  false, true,  false, false, false, false, false, false], // 5
  [true,  true,  true,  true,  true,  true,  false, true,  false, false, false, false, false, false], // 6
  [false, false, true,  false, false, false, true,  true,  false, false, false, false, false, false], // 7
  [true,  true,  true,  true,  true,  true,  true,  true,  false, false, false, false, false, false], // 8
  [true,  false, true,  true,  true,  true,  true,  true,  false, false, false, false, false, false], // 9
]

const letterSegmentMapping = {
  //       lt     lb     top    ml     mr     bot    rt     rb     ct     cb     dul    dur    dll    dlr
  'A': [true,  true,  true,  true,  true,  false, true,  true,  false, false, false, false, false, false],
  'B': [true,  true,  false, true,  true,  true,  false, true,  false, false, false, false, false, false],
  'C': [true,  true,  true,  false, false, true,  false, false, false, false, false, false, false, false],
  'D': [false, false, true,  false, false, true,  true,  true,  true,  true,  false, false, false, false],
  'E': [true,  true,  true,  true,  true,  true,  false, false, false, false, false, false, false, false],
  'F': [true,  true,  true,  true,  true,  false, false, false, false, false, false, false, false, false],
  'G': [true,  true,  true,  false, true,  true,  false, true,  false, false, false, false, false, false],
  'H': [true,  true,  false, true,  true,  false, true,  true,  false, false, false, false, false, false],
  'I': [false, false, true,  false, false, true,  false, false, true,  true,  false, false, false, false],
  'J': [false, true,  false, false, false, true,  true,  true,  false, false, false, false, false, false],
  'K': [true,  true,  false, true,  false, false, false, false, false, false, false, true,  false, true ],
  'L': [true,  true,  false, false, false, true,  false, false, false, false, false, false, false, false],
  'M': [true,  true,  false, false, false, false, true,  true,  false, false, true,  true,  false, false],
  'N': [true,  true,  false, false, false, false, true,  true,  false, false, true,  false, false, true ],
  'O': [true,  true,  true,  false, false, true,  true,  true,  false, false, false, false, false, false],
  'P': [true,  true,  true,  true,  true,  false, true,  false, false, false, false, false, false, false],
  'Q': [true,  true,  true,  false, false, true,  true,  true,  false, false, false, false, false, true ],
  'R': [true,  true,  true,  true,  true,  false, true,  false, false, false, false, false, false, true ],
  'S': [true,  false, true,  true,  true,  true,  false, true,  false, false, false, false, false, false],
  'T': [false, false, true,  false, false, false, false, false, true,  true,  false, false, false, false],
  'U': [true,  true,  false, false, false, true,  true,  true,  false, false, false, false, false, false],
  'V': [true,  true,  false, false, false, false, false, false, false, false, false, true,  true,  false],
  'W': [true,  true,  false, false, false, false, true,  true,  false, false, false, false, true,  true ],
  'X': [false, false, false, false, false, false, false, false, false, false, true,  true,  true,  true ],
  'Y': [false, false, false, false, false, false, false, false, false, true,  true,  true,  false, false],
  'Z': [false, false, true,  false, false, true,  false, false, false, false, false, true,  true,  false],
  '-': [false, false, false, true,  true,  false, false, false, false, false, false, false, false, false],
  '/': [false, false, false, false, false, false, false, false, false, false, false, true,  true,  false],
 '\\': [false, false, false, false, false, false, false, false, false, false, true,  false, false, true ],
  ' ': [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
}

export default function DigitalDigit({ digit }) {
  const mapping = (isNaN(digit) ? letterSegmentMapping[digit] : digitNumberMapping[digit])
    ?? [false, false, false, false, false, false, false, false, false, false, false, false, false, false]

  return (
    <div className="digital-digit">
      <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-left-top      ${mapping[0]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-left-bottom   ${mapping[1]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-horizontal     digital-digit-slot-middle-top    ${mapping[2]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-horizontal-half digital-digit-slot-middle-left  ${mapping[3]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-horizontal-half digital-digit-slot-middle-right ${mapping[4]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-horizontal     digital-digit-slot-middle-bottom ${mapping[5]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-right-top     ${mapping[6]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-right-bottom  ${mapping[7]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-center-top    ${mapping[8]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-center-bottom ${mapping[9]  && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-diagonal       digital-digit-slot-diag-ul       ${mapping[10] && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-diagonal       digital-digit-slot-diag-ur       ${mapping[11] && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-diagonal       digital-digit-slot-diag-ll       ${mapping[12] && 'active'}`} />
      <div className={`digital-digit-slot digital-digit-slot-diagonal       digital-digit-slot-diag-lr       ${mapping[13] && 'active'}`} />
    </div>
  )
}
