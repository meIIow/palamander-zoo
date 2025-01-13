import { Circle } from '../common/circle.ts'
import {  DisplayRange } from '../palamander-range.ts'

type SegmentViewProps = {
  circle: Circle,
  display: DisplayRange,
  magnification: number,
}

function SegmentView({ circle, display, magnification }: SegmentViewProps) {
  const styles = display.styleSegment(circle, magnification);
  return (
    <>
      {styles.map((style, i) => <div className="segment" style={style} key={i}></div>)}
    </>
  )
}

export default SegmentView