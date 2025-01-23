import { Circle } from '../../palamander/common/circle.ts'
import {  DisplayRange } from '../../palamander/palamander-range.ts'

type SegmentViewProps = {
  circle: Circle,
  display: DisplayRange,
  magnification: number,
  color: string
}

function SegmentView({ circle, display, magnification, color }: SegmentViewProps) {
  const styles = display.styleSegment(circle, magnification, color);
  return (
    <>
      {styles.map((style, i) => <div className="segment" style={style} key={i}></div>)}
    </>
  )
}

export default SegmentView