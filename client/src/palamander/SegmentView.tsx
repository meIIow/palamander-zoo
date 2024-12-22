import './SegmentView.css'
import { Circle } from './circle.ts'

type SegmentViewProps = {
  circle: Circle
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