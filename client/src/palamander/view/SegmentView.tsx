import './SegmentView.css'
import { Circle } from '../common/circle.ts'
import { PalamanderRange } from '../palamander-range.ts'

type SegmentViewProps = {
  circle: Circle,
  range: PalamanderRange,
  color: string
}

function SegmentView({ circle, range, color}: SegmentViewProps) {
  const bottomRightEdges = range.calculateBottomRightEdges(circle);
  const size = range.magnify(circle.radius);
  const styles = bottomRightEdges.map(({ x, y }) => {
    return {
      bottom: `${y}px`,
      right: `${x}px`,
      height: `${size}px`,
      width: `${size}px`,
      backgroundColor: color
    };
  });

  return (
    <>
      {/* <div className="segment" style={style}></div> */}
      {styles.map((style, i) => <div className="segment" style={style} key={i}></div>)}
    </>
  )
}

export default SegmentView