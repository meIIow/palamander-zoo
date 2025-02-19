import type { Section } from '../section.ts';
import type { Segment } from '../segment.ts';
import type { Segmentation } from './segmentation.ts';
import type { SegmentationFunc } from './segmentation-func.ts';

import { createBranch } from '../section';
import { createSegment } from '../segment';
import { toWriggle } from '../animation/wriggle';
import { createCurlSpec, createRotationSpec } from '../animation/wriggle-spec';
import {
  createSegmentation,
  createRotation,
  mixCurl,
  mixRotation,
  mixSquiggle,
  toSegments,
  preset,
} from './segmentation.ts';

/* ------------------------------------------------------------
 * Lower-Level Segmentations: Re-usable (in Pals or Chimera)
 * ------------------------------------------------------------ */

const segmentateClaw: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const dir = section.mirror ? -1 : 1;
  const upperArmSeg: Segmentation = createSegmentation({
    count: 3,
    radius: section.size * 0.4,
    angle: parent.bodyAngle.relative + 105 * dir,
    overlapMult: 0.3,
  });
  const upperArmWave = {
    range: 30,
    period: preset.period.deliberate,
    offset: section.offset,
    acceleration: 0,
  };
  const upperArm = createRotation(parent, upperArmSeg, upperArmWave);
  const lowerArmSeg: Segmentation = {
    ...upperArmSeg,
    angle: upperArmSeg.angle + 45 * dir,
  };
  const lowerArm = toSegments(upperArm[2], lowerArmSeg);

  // Add actual claw.
  const big = createSegment(section.size * 0.7, lowerArmSeg.angle, 0.2);
  const small = createSegment(
    section.size * 0.6,
    lowerArmSeg.angle + 40 * dir,
    0.2,
  );
  lowerArm[2].children.push(big);
  lowerArm[2].children.push(small);
  return [...upperArm, ...lowerArm];
};

const segmentateCurl: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const segmentation: Segmentation = {
    ...createSegmentation({ count: section.count, angle: section.angle }),
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.9,
    overlapMult: 0.5,
    curveRange: 360 / section.count,
  };
  const wave = {
    range: 120 / segmentation.count,
    period: preset.period.deliberate,
    offset: section.offset,
  };
  const segments = toSegments(parent, mixCurl(segmentation, wave));
  return segments;
};

const segmentateFeeler: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const segmentation: Segmentation = createSegmentation({
    count: 5,
    radius: (parent.circle.radius * 20) / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.2,
  });
  const segments = toSegments(parent, segmentation);
  return segments;
};

const segmentateFishTail: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const count = section.count;
  const tailSegmentation: Segmentation = createSegmentation({
    count,
    radius: section.size,
    taperFactor: 0.88,
    overlapMult: 0.6,
    curveRange: preset.curve.muscley,
  });
  const wave = {
    range: 30 / count,
    period: preset.period.deliberate,
    offset: section.offset,
    acceleration: 4,
  };
  const tail = toSegments(parent, mixCurl(tailSegmentation, wave));
  [-1, 1].forEach((i) => {
    const fin = createSegment(section.size * 0.5, 30 * i, 0.5);
    fin.wriggle = toWriggle([createCurlSpec(wave, count + 1)]);
    tail[count - 1].children.push(fin);
  });
  return tail;
};

const segmentateFlicker: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const count = 7;
  const segmentation: Segmentation = createSegmentation({
    count,
    radius: (parent.circle.radius * 15) / 100,
    taperFactor: 0.95,
    angle: section.angle + 180,
    overlapMult: 0.75,
  });
  const wave = {
    range: 30,
    period: preset.period.frenetic / 2,
    offset: section.offset,
    acceleration: 0,
  };
  const gradient = {
    wave,
    length: count,
    easeFactor: 0,
  };
  const flicker = toSegments(parent, mixSquiggle(segmentation, gradient));
  [-1, 1].forEach((i) => {
    const fork = createSegment((parent.circle.radius * 8) / 100, 140 * i, 0.75);
    fork.children.push(
      createSegment((parent.circle.radius * 8) / 100, 140 * i, 0.75),
    );
    fork.children[0].children.push(
      createSegment((parent.circle.radius * 8) / 100, 130 * i, 0.75),
    );
    // fork.wriggle = toWriggle([createSquiggleSpec(wave, count + 1, 2*count)]);
    flicker[count - 1].children.push(fork);
  });
  return flicker;
};

const segmentateFlipper: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const dir = section.mirror ? -1 : 1;
  const sizes = [40, 50, 60, 70, 40, 20];
  const curve = 15 * dir;
  let curr = parent;
  const flipper = sizes.map((size, i) => {
    const angle = section.angle * dir - i * curve;
    return createSegment((section.size * size) / 100, angle, 1.2);
  });
  flipper.forEach((segment) => {
    curr.children.push(segment);
    const waveSpec = {
      range: 20,
      period: preset.period.relaxed,
      offset: section.offset,
      acceleration: 4,
    };
    segment.wriggle = toWriggle([createRotationSpec(waveSpec)]);
    curr = segment;
  });
  return flipper;
};

const segmentateFrogLeg: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const dir = section.mirror ? -1 : 1;
  const upperLegSeg: Segmentation = createSegmentation({
    count: 3,
    radius: parent.circle.radius,
    taperFactor: 0.85,
    angle: parent.bodyAngle.relative + 75 * dir,
    overlapMult: 0.3,
    curveRange: 2,
  });
  const upperLegWave = {
    range: 45,
    period: preset.period.relaxed,
    offset: section.offset,
    acceleration: 4,
  };
  const upperLeg = createRotation(parent, upperLegSeg, upperLegWave);

  const lowerLegSeg: Segmentation = {
    ...upperLegSeg,
    radius: parent.circle.radius * 0.7,
    angle: parent.bodyAngle.relative + 10 * dir,
  };
  const lowerLegWave = {
    ...upperLegWave,
    range: 20,
  };
  const lowerLeg = createRotation(upperLeg[2], lowerLegSeg, lowerLegWave);

  // Add frog foot
  const pad = createSegment(
    parent.circle.radius * 0.6,
    parent.bodyAngle.relative + 10 * dir,
    0.5,
  );
  [1, -1].forEach((toeDir) => {
    const toe = createSegment(
      pad.circle.radius,
      pad.bodyAngle.relative + 10 * toeDir,
      0.5,
    );
    toe.children.push(
      createSegment(toe.circle.radius, toe.bodyAngle.relative, 0.5),
    );
    pad.children.push(toe);
  });
  lowerLeg[2].children.push(pad);
  return [...upperLeg, ...lowerLeg, pad];
};

const segmentateHair: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const segmentation: Segmentation = createSegmentation({
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    angle: section.angle,
    overlapMult: 1.25,
    curveRange: 20,
  });
  const rotationWave = {
    range: 5,
    period: preset.period.relaxed,
    offset: section.offset,
  };
  const curlWave = {
    range: 30,
    period: preset.period.deliberate,
    offset: section.offset,
  };
  const wrigglingSegmentation = mixRotation(
    mixCurl(segmentation, curlWave),
    rotationWave,
  );
  const segments = toSegments(parent, wrigglingSegmentation);
  return segments;
};

const segmentateMandible: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const curve = section.angle < 0 ? -10 : 10;
  const segmentation: Segmentation = createSegmentation({
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.8,
    angle: section.angle,
    curve,
  });
  const waveSpec = {
    range: 5,
    period: preset.period.deliberate,
    offset: section.offset,
    acceleration: 0,
  };
  const segments = createRotation(parent, segmentation, waveSpec);
  return segments;
};

const segmentateMonkeyArm: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const dir = section.mirror ? -1 : 1;

  const pec = createSegment(section.size * 0.75, 70 * dir, 1);
  parent.children.push(pec);

  const shoulder = createSegment(section.size * 0.7, 130 * dir, 0.6);
  pec.children.push(shoulder);

  const upperArmSeg: Segmentation = createSegmentation({
    count: 2,
    radius: section.size * 0.45,
    taperFactor: 0.9,
    angle: 75 * dir,
    overlapMult: 0.8,
  });
  const upperArmWave = {
    range: 45,
    period: preset.period.deliberate,
    offset: section.offset,
  };
  const upperArm = createRotation(shoulder, upperArmSeg, upperArmWave);

  const forearmSeg: Segmentation = createSegmentation({
    count: 3,
    radius: section.size * 0.45,
    taperFactor: 0.9,
    angle: -40 * dir,
    overlapMult: 0.8,
  });
  // Offset by PI because forearm should swing the opposive way as bicep
  const forearmWave = {
    range: 20,
    period: preset.period.deliberate,
    offset: section.offset + Math.PI,
  };
  const forearm = createRotation(upperArm[1], forearmSeg, forearmWave);

  // Turn final forearm segment into fist: bigger, with less overlap
  forearm[2].circle.radius = section.size * 0.6;
  forearm[2].overlap = 0.3 * section.size;
  return [pec, shoulder, ...upperArm, ...forearm];
};

const segmentateNoodleLimb: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const segmentation: Segmentation = createSegmentation({
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.9,
    angle: section.angle,
    curveRange: preset.curve.squiggly,
  });
  const wave = {
    range: 10,
    period: preset.period.relaxed,
    offset: section.offset,
    acceleration: 4,
  };
  const suppression = { tuckTarget: 0, tuckFactor: 0.5 };
  const gradient = {
    wave,
    increase: 0,
    suppression,
  };
  return toSegments(parent, mixSquiggle(segmentation, gradient));
};

const segmentatePod: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const dir = section.mirror ? -1 : 1;
  const pod = createSegment(section.size, section.angle + 75 * dir, 0.25);
  parent.children.push(pod);
  section.branches.push(createBranch(section, 'propellers'));
  return [pod];
};

const segmentatePropeller: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const segmentation: Segmentation = createSegmentation({
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 0.5,
  });
  const wave = {
    range: 30,
    period: preset.period.relaxed,
    offset: section.offset,
    acceleration: 5,
  };
  const gradient = {
    wave,
    length: section.count + 1.5,
  };
  return toSegments(parent, mixSquiggle(segmentation, gradient));
};

const segmentateRigidLeg: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const segmentation: Segmentation = createSegmentation({
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 0.2,
  });
  const waveSpec = {
    range: 30,
    period: preset.period.deliberate,
    offset: section.offset,
    acceleration: 4,
  };
  const segments = createRotation(parent, segmentation, waveSpec);
  return segments;
};

const segmentateSimpleLimb: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const curve = section.offset % (Math.PI * 2) == 0 ? 15 : -15; // mirror curve
  const segmentation: Segmentation = createSegmentation({
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.9,
    angle: section.angle,
    curveRange: 5,
    curve,
  });
  const waveSpec = {
    range: 10,
    period: preset.period.relaxed,
    offset: section.offset,
  };
  const segments = createRotation(parent, segmentation, waveSpec);
  return segments;
};

const segmentateTentacle: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const segmentation: Segmentation = createSegmentation({
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0,
    curveRange: preset.curve.squiggly,
  });
  const wave = {
    range: 40,
    period: preset.period.relaxed,
    offset: section.offset,
  };
  const gradient = {
    wave,
    length: section.count * 3,
    increase: 0,
  };
  return toSegments(parent, mixSquiggle(segmentation, gradient));
};

export const parts = {
  claw: segmentateClaw,
  curl: segmentateCurl,
  feeler: segmentateFeeler,
  'fish-tail': segmentateFishTail,
  flicker: segmentateFlicker,
  flipper: segmentateFlipper,
  'frog-leg': segmentateFrogLeg,
  hair: segmentateHair,
  mandible: segmentateMandible,
  'monkey-arm': segmentateMonkeyArm,
  'noodle-limb': segmentateNoodleLimb,
  pod: segmentatePod,
  propeller: segmentatePropeller,
  'rigid-leg': segmentateRigidLeg,
  'simple-limb': segmentateSimpleLimb,
  tentacle: segmentateTentacle,
};
