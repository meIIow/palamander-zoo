import { Segment } from './segment.ts';

// Represents a Palamander Section, which is used to generate a corresponding list of Segments.
// Some of these fields may be irrelevant (ignored) for some Section types.
// Some fields may be interpreted differently for some Section types.
type Section = {
  type: string; // ID that determines corresponding Segment tree structure and behavior
  count: number; // how many Segments compose this Section
  index: number; // index of parent Segment within parent Section
  size: number; // percent relative to parent Segment
  angle: number; // angle off parent Segment (degrees)
  offset: number; // for timings animations (sync or not?), etc
  mirror: boolean; // mirror any asymmetry in this section
  next: Section | null; // continuation sub-Section
  branches: Section[]; // offshoot sub-Sections
};

function createSection(type: string): Section {
  return {
    type,
    count: 0,
    index: 0,
    size: 0,
    angle: 0,
    offset: 0,
    mirror: false,
    next: null,
    branches: [],
  };
}

function createBranch(section: Section, type: string): Section {
  return { ...section, type, next: null, branches: [] };
}

function deepClone(section: Section): Section {
  const next = section.next == null ? null : deepClone(section.next);
  const branches = section.branches.map((branch) => deepClone(branch));
  return { ...section, next, branches };
}

function passthru(section: Section): Section {
  return { ...deepClone(section), index: 0 };
}

function replace(section: Section): Section {
  const replacement = { ...section };
  section.next = null;
  section.branches = [];
  return replacement;
}

// Adds a chain of nexts to a section, pushing the existing next to the back of this chain
function follow(section: Section, next: Section): Segment[] {
  const finalNext = section.next;
  section.next = next;
  let nextNext = next;
  while (nextNext.next != null) nextNext = nextNext.next;
  nextNext.next = finalNext;
  return []; // provices syntactic sugar within SegmentationFunc - can return this call
}

function calculateRadius(parent: Segment, section: Section): number {
  return (parent.circle.radius * section.size) / 100;
}

export type { Section };
export {
  calculateRadius,
  createSection,
  createBranch,
  deepClone,
  passthru,
  replace,
  follow,
};
