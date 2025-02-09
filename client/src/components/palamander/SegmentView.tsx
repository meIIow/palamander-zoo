import { Circle } from '../../palamander/common/circle.ts';
import { DisplayRange } from '../../palamander/palamander-range.ts';

type SegmentViewProps = {
  circle: Circle;
  display: DisplayRange;
  magnification: number;
  color: string;
  opacity: number;
};

function SegmentView({
  circle,
  display,
  magnification,
  color,
  opacity,
}: SegmentViewProps) {
  const styles = display.styleSegment(circle, magnification, color, opacity);
  return (
    <>
      {styles.map((style, i) => (
        <div className="segment" style={style} key={i}></div>
      ))}
    </>
  );
}

export default SegmentView;
