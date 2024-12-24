import './SegmentView.css'
import { Circle, Coordinate } from './circle.ts'

type SegmentViewProps = {
  circle: Circle
  spawn: Coordinate
}

const size = 20;

function SegmentView({ circle, spawn }: SegmentViewProps) {
  const style = {
    bottom: `${((circle.center.y - circle.radius)*size/100 + spawn.y) % window.innerHeight}px`,
    right: `${((circle.center.x - circle.radius)*size/100 + spawn.x) % window.innerWidth}px`,
    height: `${2*circle.radius*size/100}px`,
    width: `${2*circle.radius*size/100}px`,
  };

  return (
    <>
      <div className="segment" style={style}></div>
    </>
  )
}

export default SegmentView