import './SegmentView.css'
import { Circle, Coordinate } from '../common/circle.ts'

type SegmentViewProps = {
  circle: Circle,
  spawn: Coordinate,
  magnification: number
}

function SegmentView({ circle, spawn, magnification }: SegmentViewProps) {
  const style = {
    bottom: `${((circle.center.y - circle.radius)*magnification/100 + spawn.y) % window.innerHeight}px`,
    right: `${((circle.center.x - circle.radius)*magnification/100 + spawn.x) % window.innerWidth}px`,
    height: `${2*circle.radius*magnification/100}px`,
    width: `${2*circle.radius*magnification/100}px`,
  };

  return (
    <>
      <div className="segment" style={style}></div>
    </>
  )
}

export default SegmentView