import './SegmentView.css'
import { Circle } from '../common/circle.ts'
import { PalamanderRange } from '../palamander-range.ts'

type SegmentViewProps = {
  circle: Circle,
  range: PalamanderRange,
}

function SegmentView({ circle, range }: SegmentViewProps) {
  const { x, y } = range.wrapToRange(circle);
  const size = range.magnify(circle.radius);

  const style = {
    bottom: `${y}px`,
    right: `${x}px`,
    height: `${size}px`,
    width: `${size}px`,
  };

  return (
    <>
      <div className="segment" style={style}></div>
    </>
  )
}

export default SegmentView