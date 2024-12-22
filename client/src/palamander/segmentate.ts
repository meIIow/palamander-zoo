import { Segment } from "./segment"
import { Section } from "./section"
import { SegmentationFunc, getDefaultSegmentationMap, createDefaultSegment } from "./segmentation"

export default function segmentate(sectionTree: Section): Segment {
  const segmentationMap = getDefaultSegmentationMap();
  
  const processSection: SegmentationFunc = (
      parent: Segment,
      section: Section,
      processSection: SegmentationFunc): Segment[] => {
    if (!(section.type in segmentationMap)) {
      console.log(`${section.type} not present in segmentation map, skipping section ${section}`);
      return []
    }
    let segments = segmentationMap[section.type](parent, section, processSection)
    processChildren(segments, section.children);
    return segments;
  }

  const processChildren = (parentSegmentation: Segment[], children: Section[]) => {
    children.forEach((child)=> {
      const parentSegment = parentSegmentation[child.parentIndex];
      const childSegments = processSection(parentSegment, child, processSection);
      if (!childSegments.length) return;
      parentSegment.children.push(childSegments[0]);
    });
  }

  // Return head segment from segmentation of sectionTree
  return processSection(createDefaultSegment(0), sectionTree, processSection)[0];
}