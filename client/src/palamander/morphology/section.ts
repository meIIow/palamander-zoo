type Section = {
  type: string; // ID that determines corresponding Segment tree structure and behavior
  length: number; // how many Segments compose this Section
  parentIndex: number; // index of parent Segment within parent Section
  size: number; // precent relative to parent Segment
  angle: number; // angle off parent Segment (degrees)
  seed: number; // differentiates otherwise identical sections - for offsets, etc
  // next: Section | null; // sub-Section that continues this section
  children: Section[]; // offshoot sub-Sections
};

function createEmptySection(): Section {
  return {
    type: 'empty',
    length: 0,
    parentIndex: 0,
    size: 0,
    angle: 0,
    seed: 0,
    children: [],
  }
}

function createPassthruSection(): Section {
  return { ...createEmptySection(), type: 'passthru'}
}

function toPassthruChild(passthru: Section, type: string): Section {
  return {
    ...passthru,
    type,
    parentIndex: 0
  }
}

export type { Section }
export { createEmptySection, createPassthruSection, toPassthruChild }