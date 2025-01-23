import './PalamanderView.css'
import { useEffect, useState, useRef } from 'react'
import SegmentView from './SegmentView.tsx'
import { shift } from '../../palamander/common/coords.ts'
import { getSegmentCircles } from '../../palamander/morphology/segment.ts'
import { Palamander, startUpdateLoop, initializePalamanderState } from '../../palamander/palamander.ts'
import { DisplayRange } from '../../palamander/palamander-range.ts'

type PalamanderProps = {
  pal: Palamander,
  display: DisplayRange,
}

function PalamanderView({ pal, display }: PalamanderProps) {
  const divRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const [state, setState] = useState(() => initializePalamanderState(pal));

  useEffect(() => {
    // Initialize loop that triggers new render by updating the 'head' Segment state.
    return startUpdateLoop(pal, setState);
  }, [pal]);

  if (divRef.current != null) display.setRange(divRef.current.getBoundingClientRect());
  return (
    <>
      <div ref={divRef} className="palamander">
        {divRef.current == null ? null : getSegmentCircles(state.head).map((circle, i) => {
          return (<SegmentView
            circle={{ ...circle, center: shift(circle.center, state.delta)}}
            display={display}
            magnification={pal.settings.magnification}
            color={pal.settings.color}
            key={i}
          />)
        })}
      </div>
    </>
  )
}

export default PalamanderView