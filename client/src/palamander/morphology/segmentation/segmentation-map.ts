import { SegmentationFunc } from './segmentation';

import { composites } from './segmentate-composite';
import { pals } from './segmentate-pal';
import { heads } from './segmentate-head';
import { bodies } from './segmentate-body';
import { sets } from './segmentate-set';
import { parts } from './segmentate-part';

// A map from a segmentation type to its corresponding SegmentationFunc.
interface SegmentationMap {
  [key: string]: SegmentationFunc;
}

export type { SegmentationMap };
export const segmentationMap: SegmentationMap = {
  ...composites,
  ...pals,
  ...heads,
  ...bodies,
  ...sets,
  ...parts,
};
