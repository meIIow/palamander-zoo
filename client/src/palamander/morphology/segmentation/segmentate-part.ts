import type { Section } from '../section.ts';
import type { Segment } from '../segment.ts';
import type { Segmentation } from './segmentation.ts';
import type { SegmentationFunc } from './segmentation-func.ts';

import { createSegment } from '../segment';
import { toWriggle } from '../animation/wriggle';
import { createCurlSpec, createRotationSpec } from '../animation/wriggle-spec';
import {
  createSegmentation,
  createNoodleLimb,
  createRotation,
  createDefault,
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
  const upperArmSpec: Segmentation = {
    count: 3,
    radius: section.size * 0.4,
    taperFactor: 1,
    angle: parent.bodyAngle.relative + 105 * dir,
    overlapMult: 0.3,
    curveRange: 0,
    curve: 0,
  };
  const upperArmWaveSpec = {
    range: 30,
    period: preset.period.deliberate,
    offset: section.offset,
    acceleration: 0,
  };
  const upperArm = createRotation(parent, upperArmSpec, upperArmWaveSpec);
  const lowerArmSpec: Segmentation = {
    ...upperArmSpec,
    angle: upperArmSpec.angle + 45 * dir,
  };
  const lowerArm = createDefault(upperArm[2], lowerArmSpec);

  // Add actual claw.
  const big = createSegment(section.size * 0.7, lowerArmSpec.angle, 0.2);
  const small = createSegment(
    section.size * 0.6,
    lowerArmSpec.angle + 40 * dir,
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
  const spec: Segmentation = {
    ...createSegmentation(section.count, section.angle),
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.9,
    overlapMult: 0.5,
    curveRange: 360 / section.count,
  };
  const waveSpec = {
    range: 120 / spec.count,
    period: preset.period.deliberate,
    offset: section.offset,
  };
  const generateGentleCurl = (i: number) => [createCurlSpec(waveSpec, i)];
  const segments = createDefault(parent, spec, generateGentleCurl);
  return segments;
};

const segmentateFeeler: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const spec: Segmentation = {
    count: 5,
    radius: (parent.circle.radius * 20) / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.2,
    curve: 0,
    curveRange: 0,
  };
  const segments = createDefault(parent, spec);
  return segments;
};

const segmentateFishTail: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const count = section.count;
  const tailSpec: Segmentation = {
    count,
    radius: section.size,
    taperFactor: 0.88,
    angle: 0,
    overlapMult: 0.6,
    curve: 0,
    curveRange: preset.curve.muscley,
  };
  const waveSpec = {
    range: 30 / count,
    period: preset.period.deliberate,
    offset: section.offset,
    acceleration: 4,
  };
  const tailWriggle = (i: number) => [createCurlSpec(waveSpec, i)];
  const tail = createDefault(parent, tailSpec, tailWriggle);
  [-1, 1].forEach((i) => {
    const fin = createSegment(section.size * 0.5, 30 * i, 0.5);
    fin.wriggle = toWriggle(tailWriggle(count + 1));
    tail[count - 1].children.push(fin);
  });
  return tail;
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
  const upperLegSpec: Segmentation = {
    count: 3,
    radius: parent.circle.radius,
    taperFactor: 0.85,
    angle: parent.bodyAngle.relative + 75 * dir,
    overlapMult: 0.3,
    curve: 0,
    curveRange: 2,
  };
  const upperLegWave = {
    range: 45,
    period: preset.period.relaxed,
    offset: section.offset,
    acceleration: 4,
  };
  const upperLeg = createRotation(parent, upperLegSpec, upperLegWave);

  const lowerLegSpec: Segmentation = {
    ...upperLegSpec,
    radius: parent.circle.radius * 0.7,
    angle: parent.bodyAngle.relative + 10 * dir,
  };
  const lowerLegWave = {
    ...upperLegWave,
    range: 20,
  };
  const lowerLeg = createRotation(upperLeg[2], lowerLegSpec, lowerLegWave);

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
  const spec: Segmentation = {
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 1.25,
    curveRange: 20,
    curve: 0,
  };
  const generateGentleCurl = (i: number) => {
    return [
      createRotationSpec({
        range: 5,
        period: preset.period.relaxed,
        offset: section.offset,
      }),
      createCurlSpec(
        { range: 30, period: preset.period.deliberate, offset: section.offset },
        i,
      ),
    ];
  };
  const segments = createDefault(parent, spec, generateGentleCurl);
  return segments;
};

const segmentateMandible: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const curve = section.angle < 0 ? -10 : 10;
  const spec: Segmentation = {
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.8,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: 0,
    curve,
  };
  const waveSpec = {
    range: 5,
    period: preset.period.deliberate,
    offset: section.offset,
    acceleration: 0,
  };
  const segments = createRotation(parent, spec, waveSpec);
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

  const upperArmSpec: Segmentation = {
    count: 2,
    radius: section.size * 0.45,
    taperFactor: 0.9,
    angle: 75 * dir,
    overlapMult: 0.8,
    curveRange: 0,
    curve: 0,
  };
  const upperArmWaveSpec = {
    range: 45,
    period: preset.period.deliberate,
    offset: section.offset,
  };
  const upperArm = createRotation(shoulder, upperArmSpec, upperArmWaveSpec);

  const forearmSpec: Segmentation = {
    count: 3,
    radius: section.size * 0.45,
    taperFactor: 0.9,
    angle: -40 * dir,
    overlapMult: 0.8,
    curve: 0,
    curveRange: 0,
  };
  // Offset by PI because forearm should swing the opposive way as bicep
  const forearmWaveSpec = {
    range: 20,
    period: preset.period.deliberate,
    offset: section.offset + Math.PI,
  };
  const forearm = createRotation(upperArm[1], forearmSpec, forearmWaveSpec);

  // Turn final forearm segment into fist: bigger, with less overlap
  forearm[2].circle.radius = section.size * 0.6;
  forearm[2].overlap = 0.3 * section.size;
  return [pec, shoulder, ...upperArm, ...forearm];
};

const segmentateNoodleLimb: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const spec: Segmentation = {
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    curve: 0,
    curveRange: preset.curve.squiggly,
  };
  const noodleWave = {
    range: 10,
    period: preset.period.relaxed,
    offset: section.offset,
    acceleration: 4,
  };
  const segments = createNoodleLimb(
    parent,
    spec,
    noodleWave,
    parent.bodyAngle.relative,
  );
  return segments;
};

const segmentateRigidLeg: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const spec: Segmentation = {
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 0.2,
    curveRange: 0,
    curve: 0,
  };
  const waveSpec = {
    range: 30,
    period: preset.period.deliberate,
    offset: section.offset,
    acceleration: 4,
  };
  const segments = createRotation(parent, spec, waveSpec);
  return segments;
};

const segmentateSimpleLimb: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const curve = section.offset % (Math.PI * 2) == 0 ? 15 : -15; // mirror curve
  const spec: Segmentation = {
    count: section.count,
    radius: (parent.circle.radius * section.size) / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: 5,
    curve,
  };
  const waveSpec = {
    range: 10,
    period: preset.period.relaxed,
    offset: section.offset,
  };
  const segments = createRotation(parent, spec, waveSpec);
  return segments;
};

export const parts = {
  claw: segmentateClaw,
  curl: segmentateCurl,
  feeler: segmentateFeeler,
  'fish-tail': segmentateFishTail,
  flipper: segmentateFlipper,
  'frog-leg': segmentateFrogLeg,
  hair: segmentateHair,
  mandible: segmentateMandible,
  'monkey-arm': segmentateMonkeyArm,
  'noodle-limb': segmentateNoodleLimb,
  'rigid-leg': segmentateRigidLeg,
  'simple-limb': segmentateSimpleLimb,
};
