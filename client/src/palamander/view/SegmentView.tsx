import './SegmentView.css'
import { Circle, Coordinate } from '../common/circle.ts'

type SegmentViewProps = {
  circle: Circle,
  spawn: Coordinate,
  magnification: number
}

function edgeAsPixels(center: number, radius: number, magnification: number) {
  return (center - radius)*magnification/100
}

function wrapAround(x: number, boundary: number) {
  return (x + boundary) % boundary;
}

function SegmentView({ circle, spawn, magnification }: SegmentViewProps) {
  const style = {
    bottom: `${wrapAround(edgeAsPixels(circle.center.y, circle.radius, magnification) + spawn.y, window.innerHeight)}px`,
    right: `${wrapAround(edgeAsPixels(circle.center.x, circle.radius, magnification) + spawn.x, window.innerWidth)}px`,
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