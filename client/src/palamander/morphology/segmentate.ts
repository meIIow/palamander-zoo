import { Segment, createDefaultSegment } from "./segment"
import { Section } from "./section"
import { SegmentationFunc, getDefaultSegmentationMap } from "./segmentation"

export default function segmentate(sectionTree: Section): Segment {
  const segmentationMap = getDefaultSegmentationMap();
  
  const processSection: SegmentationFunc = (
      parent: Segment,
      section: Section,
      processSection: SegmentationFunc): Segment[] => {
    if (section.type == 'passthru') {
      processChildren([parent], section.next, section.branches);
      return [];
    }
    if (!(section.type in segmentationMap)) {
      console.log(`${section.type} not present in segmentation map, skipping section ${section}`);
      return []
    }
    const segments = segmentationMap[section.type](parent, section, processSection)
    return [ ...segments, ...processChildren(segments, section.next, section.branches) ];
  }

  const processChildren = (
      segmentation: Segment[],
      next: Section | null,
      branches: Section[]): Segment[] => {
    branches.forEach((branch)=> {
      const parent = segmentation[branch.index];
      processSection(parent, branch, processSection);
    });
    const parent = segmentation[segmentation.length-1];
    return (next == null) ? [] : processSection(parent, next, processSection);
  }

  // Return head segment from segmentation of sectionTree
  return processSection(createDefaultSegment(100), sectionTree, processSection)[0];
}