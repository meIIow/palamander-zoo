import { Segment } from '../segment';
import { Section } from '../section';

// A function that breaks down a given Section into its component Segments.
type SegmentationFunc = (parent: Segment, section: Section) => Segment[];

export type { SegmentationFunc };
