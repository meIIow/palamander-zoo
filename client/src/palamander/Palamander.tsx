import SegmentView from './SegmentView.tsx'
import { SegmentCircle, Segment, updateSegment, getSegmentCircles } from './segment.ts'

type PalamanderProps = {
  initialSegment: Segment,
  spawnCircle: SegmentCircle,
}

function Palamander({ initialSegment, spawnCircle }: PalamanderProps) {
  const head: Segment = updateSegment(initialSegment, spawnCircle);

  return (
    <>
      {getSegmentCircles(head).map(circle => <SegmentView circle={circle} />)}
    </>
  )
}

export default Palamander