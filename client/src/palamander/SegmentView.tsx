import './SegmentView.css'
import { SegmentCircle } from './segment.ts'

type SegmentViewProps = {
  circle: SegmentCircle
}

function SegmentView({ circle }: SegmentViewProps) {
  const style = {
    bottom: `${(circle.center.y - circle.radius) % window.innerHeight}px`,
    right: `${(circle.center.x - circle.radius) % window.innerWidth}px`,
    height: `${2*circle.radius}px`,
    width: `${2*circle.radius}px`,
  };

  return (
    <>
      <div className="segment" style={style}></div>
    </>
  )
}

export default SegmentView