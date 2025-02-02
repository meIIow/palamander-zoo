import { Segment } from '../segment';
import { Section } from '../section';

// A function that breaks down a given Section into its component Segments.
type SegmentationFunc = (parent: Segment, section: Section) => Segment[];

// Common preset values for section behavior.
const preset = {
  period: {
    relaxed: 3.5,
    deliberate: 2.75,
    frenetic: 2,
  },
  curve: {
    squiggly: 20,
    muscley: 10,
  },
};

export type { SegmentationFunc };
export { preset };
