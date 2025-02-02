import { Segment, createDefaultSegment } from '../segment';
import { Section } from '../section';
import { SegmentationFunc } from './segmentation.ts';
import { segmentationMap } from './segmentation-map.ts';

export default function segmentate(sectionTree: Section): Segment[] {
  const processSection: SegmentationFunc = (
    parent: Segment,
    section: Section,
  ): Segment[] => {
    if (!(section.type in segmentationMap)) {
      console.log(
        `${section.type} not present in segmentation map, skipping section ${section}`,
      );
      return [];
    }
    const segments = segmentationMap[section.type](parent, section);
    return [...segments, ...processChildren(section, segments, parent)];
  };

  const processChildren = (
    section: Section,
    parents: Segment[],
    grandparent: Segment,
  ): Segment[] => {
    // Next segment keys off last parent section segment, w/ grandparent as fallback.
    const last = !parents.length ? grandparent : parents[parents.length - 1];
    const follows =
      section.next == null ? [] : processSection(last, section.next);

    // Branches index off full chain (including next), w/ grandparent short-circuit available.
    const branchParents = [...parents, ...follows, grandparent];
    section.branches.forEach((branch) => {
      const parent = branchParents[branch.index];
      processSection(parent, branch);
    });

    return follows;
  };

  // Return body segments from segmentation of sectionTree
  const body = processSection(createDefaultSegment(100), sectionTree);
  body.forEach((segment) => (segment.primary = true));
  return body;
}
