type Section = {
  type: string; // ID that determines corresponding Segment tree structure and behavior
  length: number; // how many Segments compose this Section
  parentIndex: number; // index of parent Segment within parent Section
  size: number; // precent relative to parent Segment
  angle: number; // angle off parent Segment (degrees)
  seed: number; // differentiates otherwise identical sections - for offsets, etc
  mirror: boolean; // mirror this section across parent.angle axis
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
    mirror: false,
    children: [],
  };
}

function createPassthruSection(): Section {
  return { ...createEmptySection(), type: 'passthru'};
}

function createChild(section: Section, type: string): Section {
  return { ...section, type, children: [],  };
}

function toPassthruChild(passthru: Section, type: string): Section {
  return {
    ...passthru,
    type,
    parentIndex: 0
  };
}

export type { Section }
export { createChild, createEmptySection, createPassthruSection, toPassthruChild }