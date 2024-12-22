export type Section = {
  type: string; // ID that determines corresponding Segment tree structure and behavior
  length: number; // how many Segments compose this Section
  parentIndex: number; // index of parent Segment within parent Section
  size: number; // precent relative to parent Segment
  angle: number; // angle off parent Segment (degrees)
  children: Section[]; // offshoot sub-Sections
};